
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { UserRole } from '@/types';

export default function CreateProfileScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Student specific
    grade: '',
    subjects: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    // Tutor specific
    qualifications: '',
    teachingSubjects: '',
    experience: '',
    // Admin specific
    department: '',
    accessLevel: '',
  });

  const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
    {
      value: 'student',
      label: 'Student',
      icon: 'person.fill',
      description: 'Register as a student to access classes and materials',
    },
    {
      value: 'parent',
      label: 'Parent',
      icon: 'person.2.fill',
      description: 'Monitor your child&apos;s progress and attendance',
    },
    {
      value: 'tutor',
      label: 'Tutor',
      icon: 'book.fill',
      description: 'Join as a tutor to teach and manage classes',
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: 'shield.fill',
      description: 'Manage the entire tutoring system',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return false;
    }

    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    // Role-specific validation
    if (selectedRole === 'student') {
      if (!formData.grade.trim()) {
        Alert.alert('Error', 'Please enter your grade');
        return false;
      }
      if (!formData.subjects.trim()) {
        Alert.alert('Error', 'Please enter your subjects');
        return false;
      }
      if (!formData.parentName.trim() || !formData.parentPhone.trim()) {
        Alert.alert('Error', 'Please enter parent/guardian information');
        return false;
      }
    }

    if (selectedRole === 'tutor') {
      if (!formData.qualifications.trim()) {
        Alert.alert('Error', 'Please enter your qualifications');
        return false;
      }
      if (!formData.teachingSubjects.trim()) {
        Alert.alert('Error', 'Please enter subjects you can teach');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Create profile notification
    const notification = {
      id: Date.now().toString(),
      type: 'profile_created',
      role: selectedRole,
      userName: formData.name,
      userEmail: formData.email,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Store notification in AsyncStorage or send to backend
    console.log('Profile created:', { ...formData, role: selectedRole });
    console.log('Notification created:', notification);

    // In a real app, you would:
    // 1. Send data to backend API
    // 2. Store notification for admin
    // 3. Create user account

    Alert.alert(
      'Success',
      `Profile created successfully! Your ${selectedRole} account is pending approval.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderRoleSelection = () => (
    <View style={styles.roleSection}>
      <Text style={commonStyles.title}>Select Your Role</Text>
      <Text style={[commonStyles.textSecondary, { marginBottom: 20 }]}>
        Choose the role that best describes you
      </Text>

      <View style={styles.roleGrid}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.roleCard,
              selectedRole === role.value && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole(role.value)}
          >
            <View
              style={[
                styles.roleIcon,
                selectedRole === role.value && styles.roleIconSelected,
              ]}
            >
              <IconSymbol
                name={role.icon as any}
                size={32}
                color={selectedRole === role.value ? colors.card : colors.primary}
              />
            </View>
            <Text style={styles.roleLabel}>{role.label}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
            {selectedRole === role.value && (
              <View style={styles.checkmark}>
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.formSection}>
      <Text style={commonStyles.subtitle}>Basic Information</Text>

      <Text style={commonStyles.label}>Full Name *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter your full name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Email Address *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="your.email@example.com"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Phone Number *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="0821234567"
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        keyboardType="phone-pad"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Password *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Minimum 6 characters"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Confirm Password *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  const renderStudentFields = () => (
    <View style={styles.formSection}>
      <Text style={commonStyles.subtitle}>Student Information</Text>

      <Text style={commonStyles.label}>Grade *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., Grade 10"
        value={formData.grade}
        onChangeText={(value) => handleInputChange('grade', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Subjects *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., Mathematics, Science, English"
        value={formData.subjects}
        onChangeText={(value) => handleInputChange('subjects', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Parent/Guardian Name *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter parent/guardian name"
        value={formData.parentName}
        onChangeText={(value) => handleInputChange('parentName', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Parent/Guardian Phone *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="0821234567"
        value={formData.parentPhone}
        onChangeText={(value) => handleInputChange('parentPhone', value)}
        keyboardType="phone-pad"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Parent/Guardian Email</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="parent@example.com"
        value={formData.parentEmail}
        onChangeText={(value) => handleInputChange('parentEmail', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  const renderParentFields = () => (
    <View style={styles.formSection}>
      <Text style={commonStyles.subtitle}>Parent Information</Text>
      <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
        After registration, you can link your children&apos;s accounts
      </Text>
    </View>
  );

  const renderTutorFields = () => (
    <View style={styles.formSection}>
      <Text style={commonStyles.subtitle}>Tutor Information</Text>

      <Text style={commonStyles.label}>Qualifications *</Text>
      <TextInput
        style={[commonStyles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="e.g., Bachelor of Education, 5 years experience"
        value={formData.qualifications}
        onChangeText={(value) => handleInputChange('qualifications', value)}
        multiline
        numberOfLines={3}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Subjects You Can Teach *</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., Mathematics, Physical Science"
        value={formData.teachingSubjects}
        onChangeText={(value) => handleInputChange('teachingSubjects', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Years of Experience</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., 5 years"
        value={formData.experience}
        onChangeText={(value) => handleInputChange('experience', value)}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  const renderAdminFields = () => (
    <View style={styles.formSection}>
      <Text style={commonStyles.subtitle}>Admin Information</Text>

      <Text style={commonStyles.label}>Department</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., Operations, Finance"
        value={formData.department}
        onChangeText={(value) => handleInputChange('department', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={commonStyles.label}>Access Level</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="e.g., Full Access, Limited Access"
        value={formData.accessLevel}
        onChangeText={(value) => handleInputChange('accessLevel', value)}
        placeholderTextColor={colors.textSecondary}
      />

      <View style={styles.infoBox}>
        <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
          Admin accounts require approval from existing administrators
        </Text>
      </View>
    </View>
  );

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return renderStudentFields();
      case 'parent':
        return renderParentFields();
      case 'tutor':
        return renderTutorFields();
      case 'admin':
        return renderAdminFields();
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Profile',
          headerBackTitle: 'Back',
        }}
      />
      <KeyboardAvoidingView
        style={commonStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderRoleSelection()}

          {selectedRole && (
            <>
              {renderBasicInfo()}
              {renderRoleSpecificFields()}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[buttonStyles.primary, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={commonStyles.buttonText}>Create Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[buttonStyles.outline, styles.cancelButton]}
                  onPress={() => router.back()}
                >
                  <Text style={commonStyles.outlineButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  roleSection: {
    marginBottom: 24,
  },
  roleGrid: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIconSelected: {
    backgroundColor: colors.primary,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  formSection: {
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});
