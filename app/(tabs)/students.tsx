
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Platform, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockStudents } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentsScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    parentName: '',
    parentPhone: '',
  });

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    console.log('Adding new student:', newStudent);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      grade: '',
      parentName: '',
      parentPhone: '',
    });
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: user?.role === 'parent' ? 'My Children' : 'Students',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {user?.role === 'admin' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <IconSymbol name="plus" size={24} color={colors.card} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          {filteredStudents.map((student) => (
            <TouchableOpacity key={student.id} style={commonStyles.card}>
              <View style={styles.studentHeader}>
                <View style={styles.studentAvatar}>
                  <IconSymbol name="person.fill" size={28} color={colors.card} />
                </View>
                <View style={styles.studentInfo}>
                  <Text style={commonStyles.cardTitle}>{student.name}</Text>
                  <Text style={commonStyles.textSecondary}>{student.studentId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                  <Text style={[styles.statusText, { color: colors.card }]}>
                    {student.status}
                  </Text>
                </View>
              </View>

              <View style={styles.studentDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol name="graduationcap.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{student.grade}</Text>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="envelope.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{student.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="phone.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{student.phone}</Text>
                </View>
              </View>

              <View style={styles.subjectsContainer}>
                <Text style={styles.subjectsLabel}>Subjects:</Text>
                <View style={styles.subjectsList}>
                  {student.subjects.map((subject, index) => (
                    <View key={index} style={styles.subjectBadge}>
                      <Text style={styles.subjectText}>{subject}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {user?.role !== 'student' && (
                <View style={styles.parentInfo}>
                  <Text style={styles.parentLabel}>Parent/Guardian:</Text>
                  <Text style={commonStyles.text}>{student.parentName}</Text>
                  <Text style={commonStyles.textSecondary}>{student.parentPhone}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={commonStyles.title}>Add New Student</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={commonStyles.label}>Student Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.name}
                  onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
                />

                <Text style={commonStyles.label}>Email</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="student@email.com"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.email}
                  onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={commonStyles.label}>Phone</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="082 123 4567"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.phone}
                  onChangeText={(text) => setNewStudent({ ...newStudent, phone: text })}
                  keyboardType="phone-pad"
                />

                <Text style={commonStyles.label}>Grade</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Grade 10"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.grade}
                  onChangeText={(text) => setNewStudent({ ...newStudent, grade: text })}
                />

                <Text style={commonStyles.label}>Parent/Guardian Name</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Enter parent name"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.parentName}
                  onChangeText={(text) => setNewStudent({ ...newStudent, parentName: text })}
                />

                <Text style={commonStyles.label}>Parent Phone</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="082 987 6543"
                  placeholderTextColor={colors.textSecondary}
                  value={newStudent.parentPhone}
                  onChangeText={(text) => setNewStudent({ ...newStudent, parentPhone: text })}
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  style={[buttonStyles.primary, { marginTop: 16 }]}
                  onPress={handleAddStudent}
                >
                  <Text style={commonStyles.buttonText}>Add Student</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  studentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  subjectsContainer: {
    marginBottom: 12,
  },
  subjectsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  subjectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  parentInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  parentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalScroll: {
    padding: 20,
  },
});
