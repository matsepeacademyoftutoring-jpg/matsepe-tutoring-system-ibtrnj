
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockTutors } from '@/data/mockData';

export default function TutorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTutors = mockTutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Tutors',
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
              placeholder="Search tutors..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          {filteredTutors.map((tutor) => (
            <TouchableOpacity key={tutor.id} style={commonStyles.card}>
              <View style={styles.tutorHeader}>
                <View style={styles.tutorAvatar}>
                  <IconSymbol name="person.fill.checkmark" size={28} color={colors.card} />
                </View>
                <View style={styles.tutorInfo}>
                  <Text style={commonStyles.cardTitle}>{tutor.name}</Text>
                  <Text style={commonStyles.textSecondary}>{tutor.students.length} Students</Text>
                </View>
              </View>

              <View style={styles.tutorDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol name="envelope.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{tutor.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="phone.fill" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{tutor.phone}</Text>
                </View>
              </View>

              <View style={styles.qualificationsContainer}>
                <Text style={styles.qualificationsLabel}>Qualifications:</Text>
                <Text style={commonStyles.textSecondary}>{tutor.qualifications}</Text>
              </View>

              <View style={styles.subjectsContainer}>
                <Text style={styles.subjectsLabel}>Subjects:</Text>
                <View style={styles.subjectsList}>
                  {tutor.subjects.map((subject, index) => (
                    <View key={index} style={styles.subjectBadge}>
                      <Text style={styles.subjectText}>{subject}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleLabel}>Available Days:</Text>
                <View style={styles.scheduleList}>
                  {tutor.schedule.map((day, index) => (
                    <View key={index} style={styles.dayBadge}>
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
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
  scrollView: {
    flex: 1,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tutorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorDetails: {
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
  qualificationsContainer: {
    marginBottom: 12,
  },
  qualificationsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
  scheduleContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  scheduleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
});
