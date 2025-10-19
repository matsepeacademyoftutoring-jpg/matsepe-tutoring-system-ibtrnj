
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockClasses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const getClassesForDay = (day: string) => {
    return mockClasses.filter(cls => cls.schedule.day === day);
  };

  const renderWeekView = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekContainer}>
      {DAYS.map((day) => {
        const classes = getClassesForDay(day);
        return (
          <View key={day} style={styles.dayColumn}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day.substring(0, 3)}</Text>
              <View style={styles.classCountBadge}>
                <Text style={styles.classCountText}>{classes.length}</Text>
              </View>
            </View>
            <ScrollView style={styles.dayClasses}>
              {classes.map((cls) => (
                <TouchableOpacity key={cls.id} style={styles.weekClassCard}>
                  <Text style={styles.weekClassTime}>{cls.schedule.startTime}</Text>
                  <Text style={styles.weekClassSubject} numberOfLines={2}>{cls.subject}</Text>
                  <Text style={styles.weekClassGrade}>{cls.grade}</Text>
                </TouchableOpacity>
              ))}
              {classes.length === 0 && (
                <View style={styles.emptyDay}>
                  <Text style={styles.emptyDayText}>No classes</Text>
                </View>
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderDayView = () => {
    const classes = getClassesForDay(selectedDay);
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
        {classes.map((cls) => (
          <TouchableOpacity key={cls.id} style={commonStyles.card}>
            <View style={styles.classHeader}>
              <View style={styles.timeContainer}>
                <IconSymbol name="clock.fill" size={20} color={colors.primary} />
                <Text style={styles.classTime}>
                  {cls.schedule.startTime} - {cls.schedule.endTime}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.statusText, { color: colors.card }]}>
                  {cls.status}
                </Text>
              </View>
            </View>

            <Text style={commonStyles.cardTitle}>{cls.subject}</Text>
            <Text style={commonStyles.textSecondary}>{cls.grade}</Text>

            <View style={styles.classDetails}>
              <View style={styles.detailRow}>
                <IconSymbol name="person.fill.checkmark" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{cls.tutorName}</Text>
              </View>
              {cls.room && (
                <View style={styles.detailRow}>
                  <IconSymbol name="building.2.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{cls.room}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <IconSymbol name="person.3.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{cls.studentIds.length} Students</Text>
              </View>
            </View>

            {user?.role === 'tutor' && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Mark Attendance</Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {classes.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="calendar.badge.exclamationmark" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No classes scheduled for {selectedDay}</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Schedule',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
              onPress={() => setViewMode('week')}
            >
              <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'day' && styles.toggleButtonActive]}
              onPress={() => setViewMode('day')}
            >
              <Text style={[styles.toggleText, viewMode === 'day' && styles.toggleTextActive]}>
                Day
              </Text>
            </TouchableOpacity>
          </View>

          {viewMode === 'day' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.daySelectorButton, selectedDay === day && styles.daySelectorButtonActive]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.daySelectorText, selectedDay === day && styles.daySelectorTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {viewMode === 'week' ? renderWeekView() : renderDayView()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.card,
  },
  daySelector: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  daySelectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  daySelectorButtonActive: {
    backgroundColor: colors.primary,
  },
  daySelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  daySelectorTextActive: {
    color: colors.card,
  },
  weekContainer: {
    flex: 1,
  },
  dayColumn: {
    width: 150,
    marginHorizontal: 8,
    marginTop: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  dayHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  classCountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  classCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  dayClasses: {
    flex: 1,
  },
  weekClassCard: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  weekClassTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  weekClassSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  weekClassGrade: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyDay: {
    padding: 20,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  classTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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
  classDetails: {
    gap: 8,
    marginTop: 12,
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
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
