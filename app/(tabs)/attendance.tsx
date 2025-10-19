
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { mockClasses, mockStudents } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused' | null;
}

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(
    mockStudents.map(student => ({
      studentId: student.id,
      status: null,
    }))
  );

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmit = () => {
    const unmarked = attendance.filter(record => record.status === null);
    
    if (unmarked.length > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `${unmarked.length} student(s) have not been marked. Do you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => {
              console.log('Attendance submitted:', {
                classId: selectedClass.id,
                date: selectedDate,
                attendance,
              });
              Alert.alert('Success', 'Attendance has been recorded successfully!');
            },
          },
        ]
      );
    } else {
      console.log('Attendance submitted:', {
        classId: selectedClass.id,
        date: selectedDate,
        attendance,
      });
      Alert.alert('Success', 'Attendance has been recorded successfully!');
    }
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    setAttendance(prev =>
      prev.map(record => ({ ...record, status }))
    );
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return colors.success;
      case 'absent':
        return colors.error;
      case 'late':
        return colors.warning;
      case 'excused':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'checkmark.circle.fill';
      case 'absent':
        return 'xmark.circle.fill';
      case 'late':
        return 'clock.fill';
      case 'excused':
        return 'exclamationmark.circle.fill';
      default:
        return 'circle';
    }
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentGrade = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.grade || '';
  };

  const markedCount = attendance.filter(r => r.status !== null).length;
  const presentCount = attendance.filter(r => r.status === 'present').length;
  const absentCount = attendance.filter(r => r.status === 'absent').length;
  const lateCount = attendance.filter(r => r.status === 'late').length;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mark Attendance',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Class Information</Text>
            <View style={styles.classInfo}>
              <View style={styles.infoRow}>
                <IconSymbol name="book.fill" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  {selectedClass.subject} - {selectedClass.grade}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <IconSymbol name="person.fill" size={20} color={colors.secondary} />
                <Text style={styles.infoText}>{selectedClass.tutorName}</Text>
              </View>
              <View style={styles.infoRow}>
                <IconSymbol name="calendar" size={20} color={colors.accent} />
                <Text style={styles.infoText}>
                  {new Date(selectedDate).toLocaleDateString('en-ZA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{markedCount}/{attendance.length}</Text>
                <Text style={styles.summaryLabel}>Marked</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.success }]}>
                  {presentCount}
                </Text>
                <Text style={styles.summaryLabel}>Present</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.error }]}>
                  {absentCount}
                </Text>
                <Text style={styles.summaryLabel}>Absent</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNumber, { color: colors.warning }]}>
                  {lateCount}
                </Text>
                <Text style={styles.summaryLabel}>Late</Text>
              </View>
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={styles.quickActionsHeader}>
              <Text style={commonStyles.cardTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: colors.success }]}
                onPress={() => handleMarkAll('present')}
              >
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
                <Text style={styles.quickActionText}>Mark All Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: colors.error }]}
                onPress={() => handleMarkAll('absent')}
              >
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.card} />
                <Text style={styles.quickActionText}>Mark All Absent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Students ({attendance.length})</Text>
            {attendance.map((record, index) => (
              <View key={record.studentId} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <View style={styles.studentAvatar}>
                    <IconSymbol name="person.fill" size={20} color={colors.card} />
                  </View>
                  <View style={styles.studentDetails}>
                    <Text style={commonStyles.text}>{getStudentName(record.studentId)}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {getStudentGrade(record.studentId)}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      record.status === 'present' && {
                        backgroundColor: colors.success,
                      },
                    ]}
                    onPress={() => handleStatusChange(record.studentId, 'present')}
                  >
                    <IconSymbol
                      name="checkmark.circle.fill"
                      size={24}
                      color={record.status === 'present' ? colors.card : colors.success}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      record.status === 'late' && {
                        backgroundColor: colors.warning,
                      },
                    ]}
                    onPress={() => handleStatusChange(record.studentId, 'late')}
                  >
                    <IconSymbol
                      name="clock.fill"
                      size={24}
                      color={record.status === 'late' ? colors.card : colors.warning}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      record.status === 'absent' && {
                        backgroundColor: colors.error,
                      },
                    ]}
                    onPress={() => handleStatusChange(record.studentId, 'absent')}
                  >
                    <IconSymbol
                      name="xmark.circle.fill"
                      size={24}
                      color={record.status === 'absent' ? colors.card : colors.error}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      record.status === 'excused' && {
                        backgroundColor: colors.accent,
                      },
                    ]}
                    onPress={() => handleStatusChange(record.studentId, 'excused')}
                  >
                    <IconSymbol
                      name="exclamationmark.circle.fill"
                      size={24}
                      color={record.status === 'excused' ? colors.card : colors.accent}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={buttonStyles.primaryText}>Submit Attendance</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  classInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '20%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActionsHeader: {
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  submitButton: {
    marginTop: 16,
  },
});
