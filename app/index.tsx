
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Login attempt with:', email);
    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)/(home)');
    }
  };

  const quickLogin = (role: string) => {
    const emails = {
      admin: 'admin@matsepe.com',
      tutor: 'tutor@matsepe.com',
      student: 'student@matsepe.com',
      parent: 'parent@matsepe.com',
    };
    setEmail(emails[role as keyof typeof emails] || '');
    setPassword('password123');
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <IconSymbol name="book.fill" size={48} color={colors.card} />
            </View>
            <Text style={styles.logoText}>Matsepe Academy</Text>
            <Text style={styles.logoSubtext}>of Tutoring</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={buttonStyles.primary} onPress={handleLogin}>
              <Text style={commonStyles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[buttonStyles.outline, styles.createProfileButton]}
              onPress={() => router.push('/create-profile')}
            >
              <IconSymbol name="person.badge.plus" size={20} color={colors.primary} />
              <Text style={[commonStyles.outlineButtonText, { marginLeft: 8 }]}>
                Create New Profile
              </Text>
            </TouchableOpacity>

            <View style={styles.quickLoginContainer}>
              <Text style={styles.quickLoginTitle}>Quick Login (Demo)</Text>
              <View style={styles.quickLoginButtons}>
                <TouchableOpacity
                  style={styles.quickLoginButton}
                  onPress={() => quickLogin('admin')}
                >
                  <IconSymbol name="shield.fill" size={20} color={colors.primary} />
                  <Text style={styles.quickLoginText}>Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLoginButton}
                  onPress={() => quickLogin('tutor')}
                >
                  <IconSymbol name="book.fill" size={20} color={colors.secondary} />
                  <Text style={styles.quickLoginText}>Tutor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLoginButton}
                  onPress={() => quickLogin('student')}
                >
                  <IconSymbol name="person.fill" size={20} color={colors.accent} />
                  <Text style={styles.quickLoginText}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLoginButton}
                  onPress={() => quickLogin('parent')}
                >
                  <IconSymbol name="person.2.fill" size={20} color={colors.warning} />
                  <Text style={styles.quickLoginText}>Parent</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  logoSubtext: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  createProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLoginContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickLoginTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  quickLoginText: {
    fontSize: 14,
    color: colors.text,
  },
});
