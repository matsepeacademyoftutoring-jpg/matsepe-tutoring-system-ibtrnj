
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockStudents, mockClasses, mockPayments, mockProfileNotifications } from '@/data/mockData';
import { ProfileNotification } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockProfileNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'student':
        return 'person.fill';
      case 'tutor':
        return 'book.fill';
      case 'parent':
        return 'person.2.fill';
      case 'admin':
        return 'shield.fill';
      default:
        return 'person.fill';
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'student':
        return colors.primary;
      case 'tutor':
        return colors.secondary;
      case 'parent':
        return colors.accent;
      case 'admin':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const renderNotificationModal = () => (
    <Modal
      visible={showNotifications}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowNotifications(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={commonStyles.title}>Profile Notifications</Text>
          <TouchableOpacity onPress={() => setShowNotifications(false)}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <IconSymbol name="checkmark.circle" size={20} color={colors.primary} />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}

        <ScrollView style={styles.notificationsList}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="bell.slash" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 12 }]}>No notifications</Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.notificationUnread,
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: getRoleColor(notification.role) },
                  ]}
                >
                  <IconSymbol
                    name={getRoleIcon(notification.role) as any}
                    size={24}
                    color={colors.card}
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      New {notification.role} profile created
                    </Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={commonStyles.text}>{notification.userName}</Text>
                  <Text style={commonStyles.textSecondary}>{notification.userEmail}</Text>

                  {notification.additionalInfo && (
                    <View style={styles.additionalInfo}>
                      {notification.additionalInfo.grade && (
                        <Text style={styles.infoText}>
                          Grade: {notification.additionalInfo.grade}
                        </Text>
                      )}
                      {notification.additionalInfo.subjects && (
                        <Text style={styles.infoText}>
                          Subjects: {notification.additionalInfo.subjects}
                        </Text>
                      )}
                      {notification.additionalInfo.qualifications && (
                        <Text style={styles.infoText}>
                          {notification.additionalInfo.qualifications}
                        </Text>
                      )}
                    </View>
                  )}

                  <Text style={styles.notificationTime}>
                    {formatTimeAgo(notification.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderAdminDashboard = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
      <View style={styles.welcomeSection}>
        <View>
          <Text style={commonStyles.title}>Welcome, {user?.name}!</Text>
          <Text style={commonStyles.textSecondary}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => setShowNotifications(true)}
        >
          <IconSymbol name="bell.fill" size={24} color={colors.primary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
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

      {unreadCount > 0 && (
        <TouchableOpacity
          style={[commonStyles.card, styles.notificationCard]}
          onPress={() => setShowNotifications(true)}
        >
          <View style={styles.notificationCardHeader}>
            <IconSymbol name="bell.badge.fill" size={28} color={colors.primary} />
            <View style={styles.notificationCardContent}>
              <Text style={styles.notificationCardTitle}>
                {unreadCount} New Profile{unreadCount !== 1 ? 's' : ''} Created
              </Text>
              <Text style={commonStyles.textSecondary}>
                Tap to view and approve new registrations
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      )}

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/notifications')}
        >
          <IconSymbol name="bell.badge.fill" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Send Notification to Parents</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/payments')}
        >
          <IconSymbol name="creditcard.fill" size={24} color={colors.accent} />
          <Text style={styles.actionText}>Manage Payments</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <IconSymbol name="gearshape.fill" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Academy Settings</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/create-profile')}
        >
          <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Register New Profile</Text>
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

      {renderNotificationModal()}
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
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/attendance')}
        >
          <IconSymbol name="checkmark.circle" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Mark Attendance</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/materials')}
        >
          <IconSymbol name="doc.text" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Upload Materials</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/schedule')}
        >
          <IconSymbol name="calendar" size={24} color={colors.accent} />
          <Text style={styles.actionText}>View Full Schedule</Text>
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

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/progress')}
        >
          <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
          <Text style={styles.actionText}>View Progress Report</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/materials')}
        >
          <IconSymbol name="doc.text.fill" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Study Materials</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/schedule')}
        >
          <IconSymbol name="calendar" size={24} color={colors.accent} />
          <Text style={styles.actionText}>My Schedule</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
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
          <TouchableOpacity 
            key={student.id} 
            style={styles.studentItem}
            onPress={() => router.push('/(tabs)/students')}
          >
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
            <Text style={commonStyles.textSecondary}>Due: 31/03/2024</Text>
          </View>
          <View style={[styles.paymentBadge, { backgroundColor: colors.warning }]}>
            <Text style={[styles.paymentBadgeText, { color: colors.card }]}>Pending</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 12 }]}
          onPress={() => router.push('/(tabs)/payments')}
        >
          <IconSymbol name="arrow.up.doc.fill" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Upload Proof of Payment</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/progress')}
        >
          <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
          <Text style={styles.actionText}>View Child&apos;s Progress</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/schedule')}
        >
          <IconSymbol name="calendar" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>View Schedule</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/notifications')}
        >
          <IconSymbol name="bell.fill" size={24} color={colors.accent} />
          <Text style={styles.actionText}>View Notifications</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
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
  notificationCard: {
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  notificationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationCardContent: {
    flex: 1,
  },
  notificationCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    gap: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationUnread: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginLeft: 8,
  },
  additionalInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
