
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import { appSettings, updateAppSettings } from '@/data/mockData';
import { AppSettings } from '@/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  readOnlyInput: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  saveButton: {
    ...buttonStyles.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  paymentMethodChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  paymentMethodText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default function SettingsScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(appSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateAppSettings(settings);
    setHasChanges(false);
    Alert.alert('Success', 'Settings saved successfully!');
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset to default South African settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings(appSettings);
            setHasChanges(false);
          },
        },
      ]
    );
  };

  if (user?.role !== 'admin') {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Stack.Screen options={{ title: 'Settings' }} />
        <IconSymbol name="lock.fill" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={commonStyles.subtitle}>Access Denied</Text>
        <Text style={commonStyles.textSecondary}>Only administrators can access settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Academy Settings' }} />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={commonStyles.title}>Academy Settings</Text>
          <Text style={commonStyles.textSecondary}>
            Configure your academy settings for South Africa
          </Text>
        </View>

        {/* Academy Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="building.2.fill" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            Academy Information
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Academy Name</Text>
            <TextInput
              style={styles.input}
              value={settings.academyName}
              onChangeText={(value) => handleInputChange('academyName', value)}
              placeholder="Enter academy name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput
              style={styles.input}
              value={settings.contactEmail}
              onChangeText={(value) => handleInputChange('contactEmail', value)}
              placeholder="info@academy.co.za"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={settings.contactPhone}
              onChangeText={(value) => handleInputChange('contactPhone', value)}
              placeholder="011 234 5678"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Physical Address</Text>
            <TextInput
              style={styles.input}
              value={settings.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Street, City, Province, Postal Code"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tax Number (VAT)</Text>
            <TextInput
              style={styles.input}
              value={settings.taxNumber}
              onChangeText={(value) => handleInputChange('taxNumber', value)}
              placeholder="VAT Registration Number"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Regional Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="globe" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            Regional Settings (South Africa)
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={settings.country}
              editable={false}
            />
            <Text style={styles.infoText}>Fixed to South Africa</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={`${settings.currency} (${settings.currencySymbol})`}
              editable={false}
            />
            <Text style={styles.infoText}>South African Rand</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date Format</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={settings.dateFormat}
              editable={false}
            />
            <Text style={styles.infoText}>Day/Month/Year (SA Standard)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time Format</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={settings.timeFormat === '24h' ? '24-hour' : '12-hour'}
              editable={false}
            />
            <Text style={styles.infoText}>24-hour format (SA Standard)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Timezone</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={settings.timezone}
              editable={false}
            />
            <Text style={styles.infoText}>South African Standard Time (SAST)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Language</Text>
            <TextInput
              style={styles.input}
              value={settings.language}
              onChangeText={(value) => handleInputChange('language', value)}
              placeholder="English"
            />
          </View>
        </View>

        {/* Banking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="creditcard.fill" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            Banking Details
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={styles.input}
              value={settings.bankName}
              onChangeText={(value) => handleInputChange('bankName', value)}
              placeholder="e.g., Standard Bank, FNB, ABSA"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              value={settings.bankAccountNumber}
              onChangeText={(value) => handleInputChange('bankAccountNumber', value)}
              placeholder="Account Number"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Branch Code</Text>
            <TextInput
              style={styles.input}
              value={settings.bankBranchCode}
              onChangeText={(value) => handleInputChange('bankBranchCode', value)}
              placeholder="6-digit branch code"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Accepted Payment Methods</Text>
            <View style={styles.paymentMethodsContainer}>
              {settings.paymentMethods.map((method, index) => (
                <View key={index} style={styles.paymentMethodChip}>
                  <Text style={styles.paymentMethodText}>{method}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.infoText}>
              Bank Transfer, Cash, EFT, SnapScan, Zapper
            </Text>
          </View>
        </View>

        {/* Legal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <IconSymbol name="doc.text.fill" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            Legal Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Terms and Conditions</Text>
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              value={settings.termsAndConditions}
              onChangeText={(value) => handleInputChange('termsAndConditions', value)}
              placeholder="Enter terms and conditions"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Privacy Policy</Text>
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              value={settings.privacyPolicy}
              onChangeText={(value) => handleInputChange('privacyPolicy', value)}
              placeholder="Enter privacy policy"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.saveButton, !hasChanges && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={styles.saveButtonText}>
              {hasChanges ? 'Save Changes' : 'No Changes to Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.outline, { marginTop: 8 }]}
            onPress={handleReset}
          >
            <Text style={commonStyles.outlineButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
