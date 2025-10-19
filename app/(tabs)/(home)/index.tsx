
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockStudents, mockClasses, mockPayments } from '@/data/mockData';

export default function HomeScreen() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={commonStyles.title}>Welcome, {user?.name}!</Text>
        <Text style={commonStyles.textSecondary}>Admin Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.primary }]}>
          <IconSymbol name="person.3.fill" size={32} color={colors.card} />
          <Text style={styles.statNumber}>{mockStudents.length}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>

        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.secondary }]}>
          <IconSymbol name="calendar" size={32} color={colors.card} />
          <Text style={styles.statNumber}>{mockClasses.length}</Text>
          <Text style={styles.statLabel}>Active Classes</Text>
        </View>

        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.accent }]}>
          <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.card} />
          <Text style={styles.statNumber}>R{mockPayments.reduce((sum, p) => sum + p.amount, 0)}</Text>
          <Text style={styles.statLabel}>Revenue (MTD)</Text>
        </View>

        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.warning }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={32} color={colors.card} />
          <Text style={styles.statNumber}>{mockPayments.filter(p => p.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending Payments</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Register New Student</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="calendar.badge.plus" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Schedule New Class</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="chart.bar.doc.horizontal" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Generate Reports</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: colors.success }]} />
          <View style={styles.activityContent}>
            <Text style={commonStyles.text}>New student enrolled</Text>
            <Text style={commonStyles.textSecondary}>Thabo Molefe - 2 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: colors.primary }]} />
          <View style={styles.activityContent}>
            <Text style={commonStyles.text}>Payment received</Text>
            <Text style={commonStyles.textSecondary}>Lerato Dlamini - R1,500 - 5 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: colors.accent }]} />
          <View style={styles.activityContent}>
            <Text style={commonStyles.text}>Class completed</Text>
            <Text style={commonStyles.textSecondary}>Grade 10 Mathematics - 1 day ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTutorDashboard = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={commonStyles.title}>Welcome, {user?.name}!</Text>
        <Text style={commonStyles.textSecondary}>Tutor Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.primary }]}>
          <IconSymbol name="person.3.fill" size={32} color={colors.card} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>My Students</Text>
        </View>

        <View style={[commonStyles.card, styles.statCard, { backgroundColor: colors.secondary }]}>
          <IconSymbol name="calendar" size={32} color={colors.card} />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Classes Today</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Today&apos;s Schedule</Text>
        {mockClasses.slice(0, 2).map((cls) => (
          <View key={cls.id} style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>{cls.schedule.startTime}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={commonStyles.text}>{cls.subject} - {cls.grade}</Text>
              <Text style={commonStyles.textSecondary}>{cls.room}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="checkmark.circle" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Mark Attendance</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="doc.text" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Upload Materials</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStudentDashboard = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={commonStyles.title}>Welcome, {user?.name}!</Text>
        <Text style={commonStyles.textSecondary}>Student Dashboard</Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Upcoming Classes</Text>
        {mockClasses.slice(0, 3).map((cls) => (
          <View key={cls.id} style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>{cls.schedule.startTime}</Text>
              <Text style={styles.dayText}>{cls.schedule.day}</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={commonStyles.text}>{cls.subject}</Text>
              <Text style={commonStyles.textSecondary}>{cls.tutorName}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Recent Assessments</Text>
        <View style={styles.assessmentItem}>
          <View style={styles.assessmentInfo}>
            <Text style={commonStyles.text}>Mathematics Test</Text>
            <Text style={commonStyles.textSecondary}>March 15, 2024</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>85%</Text>
          </View>
        </View>
        <View style={styles.assessmentItem}>
          <View style={styles.assessmentInfo}>
            <Text style={commonStyles.text}>Science Quiz</Text>
            <Text style={commonStyles.textSecondary}>March 17, 2024</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>92%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderParentDashboard = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={commonStyles.title}>Welcome, {user?.name}!</Text>
        <Text style={commonStyles.textSecondary}>Parent Dashboard</Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Your Children</Text>
        {mockStudents.slice(0, 2).map((student) => (
          <TouchableOpacity key={student.id} style={styles.studentItem}>
            <View style={styles.studentAvatar}>
              <IconSymbol name="person.fill" size={24} color={colors.card} />
            </View>
            <View style={styles.studentInfo}>
              <Text style={commonStyles.text}>{student.name}</Text>
              <Text style={commonStyles.textSecondary}>{student.grade}</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Payment Status</Text>
        <View style={styles.paymentItem}>
          <View style={styles.paymentInfo}>
            <Text style={commonStyles.text}>March 2024 Tuition</Text>
            <Text style={commonStyles.textSecondary}>Due: March 31, 2024</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.success }]}>
            <Text style={[styles.badgeText, { color: colors.card }]}>Paid</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'tutor':
        return renderTutorDashboard();
      case 'student':
        return renderStudentDashboard();
      case 'parent':
        return renderParentDashboard();
      default:
        return renderAdminDashboard();
    }
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Dashboard',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={commonStyles.container}>
        {renderDashboard()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.card,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleTime: {
    width: 80,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scheduleDetails: {
    flex: 1,
  },
  assessmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  assessmentInfo: {
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
