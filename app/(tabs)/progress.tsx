
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockAssessments, mockAttendance } from '@/data/mockData';

export default function ProgressScreen() {
  const calculateAverage = () => {
    const total = mockAssessments.reduce((sum, assessment) => 
      sum + (assessment.score / assessment.maxScore) * 100, 0
    );
    return (total / mockAssessments.length).toFixed(1);
  };

  const attendanceRate = () => {
    const present = mockAttendance.filter(a => a.status === 'present').length;
    return ((present / mockAttendance.length) * 100).toFixed(1);
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Progress',
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
              <IconSymbol name="chart.bar.fill" size={32} color={colors.card} />
              <Text style={styles.statValue}>{calculateAverage()}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.card} />
              <Text style={styles.statValue}>{attendanceRate()}%</Text>
              <Text style={styles.statLabel}>Attendance Rate</Text>
            </View>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Recent Assessments</Text>
            {mockAssessments.map((assessment) => {
              const percentage = (assessment.score / assessment.maxScore) * 100;
              const color = percentage >= 75 ? colors.success : percentage >= 50 ? colors.accent : colors.error;
              
              return (
                <View key={assessment.id} style={styles.assessmentItem}>
                  <View style={styles.assessmentInfo}>
                    <Text style={commonStyles.text}>{assessment.title}</Text>
                    <Text style={commonStyles.textSecondary}>{assessment.subject}</Text>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                      {new Date(assessment.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <View style={[styles.scoreCircle, { borderColor: color }]}>
                      <Text style={[styles.scorePercentage, { color }]}>
                        {percentage.toFixed(0)}%
                      </Text>
                    </View>
                    <Text style={styles.scoreDetail}>
                      {assessment.score}/{assessment.maxScore}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Subject Performance</Text>
            {['Mathematics', 'Physical Science', 'English'].map((subject) => {
              const subjectAssessments = mockAssessments.filter(a => a.subject === subject);
              if (subjectAssessments.length === 0) return null;
              
              const avg = subjectAssessments.reduce((sum, a) => 
                sum + (a.score / a.maxScore) * 100, 0
              ) / subjectAssessments.length;

              return (
                <View key={subject} style={styles.subjectItem}>
                  <View style={styles.subjectInfo}>
                    <Text style={commonStyles.text}>{subject}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {subjectAssessments.length} assessments
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${avg}%`,
                            backgroundColor: avg >= 75 ? colors.success : avg >= 50 ? colors.accent : colors.error
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{avg.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Attendance History</Text>
            {mockAttendance.map((record) => {
              const statusColors = {
                present: colors.success,
                absent: colors.error,
                late: colors.warning,
                excused: colors.accent,
              };

              return (
                <View key={record.id} style={styles.attendanceItem}>
                  <View style={[styles.attendanceDot, { backgroundColor: statusColors[record.status] }]} />
                  <View style={styles.attendanceInfo}>
                    <Text style={commonStyles.text}>
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={commonStyles.textSecondary}>Class ID: {record.classId}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors[record.status] }]}>
                    <Text style={[styles.statusText, { color: colors.card }]}>
                      {record.status}
                    </Text>
                  </View>
                </View>
              );
            })}
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
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
    alignItems: 'center',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  scorePercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  subjectItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectInfo: {
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 45,
    textAlign: 'right',
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  attendanceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  attendanceInfo: {
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
});
