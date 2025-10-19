
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleSwitchRole = () => {
    const roles = ['admin', 'tutor', 'student', 'parent'];
    Alert.alert(
      'Switch Role (Demo)',
      'Select a role to switch to:',
      roles.map(role => ({
        text: role.charAt(0).toUpperCase() + role.slice(1),
        onPress: () => switchRole(role as any),
      }))
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={48} color={colors.card} />
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.roleText, { color: colors.card }]}>
                {user?.role?.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Account Settings</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="person.circle" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="lock.fill" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="bell.fill" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>App Settings</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="moon.fill" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <View style={styles.switchPlaceholder}>
                <Text style={styles.switchText}>Coming Soon</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="globe" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Language</Text>
              </View>
              <Text style={styles.menuItemValue}>English</Text>
            </TouchableOpacity>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Support</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="questionmark.circle" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Help Center</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="envelope.fill" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Contact Support</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="doc.text" size={24} color={colors.primary} />
                <Text style={styles.menuItemText}>Terms & Privacy</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Demo Features</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleSwitchRole}>
              <View style={styles.menuItemLeft}>
                <IconSymbol name="arrow.triangle.2.circlepath" size={24} color={colors.accent} />
                <Text style={styles.menuItemText}>Switch Role</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[buttonStyles.primary, { backgroundColor: colors.error, marginTop: 8 }]}
            onPress={handleLogout}
          >
            <Text style={commonStyles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Matsepe Academy v1.0.0</Text>
            <Text style={styles.footerText}>© 2024 All rights reserved</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  menuItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchPlaceholder: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  switchText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
