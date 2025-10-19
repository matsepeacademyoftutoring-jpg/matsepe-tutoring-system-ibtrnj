
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)/(home)');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <IconSymbol name="book.fill" size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>Matsepe Academy</Text>
          <Text style={styles.subtitle}>Tutoring Management System</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Email Address</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={commonStyles.label}>Password</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[buttonStyles.primary, styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Quick Login (Demo)</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.quickLoginContainer}>
            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={() => quickLogin('admin')}
            >
              <IconSymbol name="person.badge.key.fill" size={24} color={colors.primary} />
              <Text style={styles.quickLoginText}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={() => quickLogin('tutor')}
            >
              <IconSymbol name="person.fill.checkmark" size={24} color={colors.secondary} />
              <Text style={styles.quickLoginText}>Tutor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={() => quickLogin('student')}
            >
              <IconSymbol name="graduationcap.fill" size={24} color={colors.accent} />
              <Text style={styles.quickLoginText}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLoginButton}
              onPress={() => quickLogin('parent')}
            >
              <IconSymbol name="person.2.fill" size={24} color={colors.warning} />
              <Text style={styles.quickLoginText}>Parent</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact support@matsepe.com
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickLoginContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickLoginButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  quickLoginText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
