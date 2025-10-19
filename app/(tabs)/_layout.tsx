
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const { user } = useAuth();

  // Define tabs based on user role
  const getTabsForRole = (): TabBarItem[] => {
    const baseTabs: TabBarItem[] = [
      {
        name: '(home)',
        route: '/(tabs)/(home)/',
        icon: 'house.fill',
        label: 'Home',
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseTabs,
        {
          name: 'students',
          route: '/(tabs)/students',
          icon: 'person.3.fill',
          label: 'Students',
        },
        {
          name: 'tutors',
          route: '/(tabs)/tutors',
          icon: 'person.fill.checkmark',
          label: 'Tutors',
        },
        {
          name: 'payments',
          route: '/(tabs)/payments',
          icon: 'creditcard.fill',
          label: 'Payments',
        },
        {
          name: 'notifications',
          route: '/(tabs)/notifications',
          icon: 'bell.fill',
          label: 'Notify',
        },
        {
          name: 'settings',
          route: '/(tabs)/settings',
          icon: 'gearshape.fill',
          label: 'Settings',
        },
      ];
    } else if (user?.role === 'tutor') {
      return [
        ...baseTabs,
        {
          name: 'students',
          route: '/(tabs)/students',
          icon: 'person.3.fill',
          label: 'Students',
        },
        {
          name: 'schedule',
          route: '/(tabs)/schedule',
          icon: 'calendar',
          label: 'Schedule',
        },
        {
          name: 'materials',
          route: '/(tabs)/materials',
          icon: 'doc.text.fill',
          label: 'Materials',
        },
        {
          name: 'profile',
          route: '/(tabs)/profile',
          icon: 'person.fill',
          label: 'Profile',
        },
      ];
    } else if (user?.role === 'student') {
      return [
        ...baseTabs,
        {
          name: 'schedule',
          route: '/(tabs)/schedule',
          icon: 'calendar',
          label: 'Schedule',
        },
        {
          name: 'materials',
          route: '/(tabs)/materials',
          icon: 'doc.text.fill',
          label: 'Materials',
        },
        {
          name: 'progress',
          route: '/(tabs)/progress',
          icon: 'chart.bar.fill',
          label: 'Progress',
        },
        {
          name: 'profile',
          route: '/(tabs)/profile',
          icon: 'person.fill',
          label: 'Profile',
        },
      ];
    } else if (user?.role === 'parent') {
      return [
        ...baseTabs,
        {
          name: 'students',
          route: '/(tabs)/students',
          icon: 'person.3.fill',
          label: 'Children',
        },
        {
          name: 'payments',
          route: '/(tabs)/payments',
          icon: 'creditcard.fill',
          label: 'Payments',
        },
        {
          name: 'progress',
          route: '/(tabs)/progress',
          icon: 'chart.bar.fill',
          label: 'Progress',
        },
        {
          name: 'profile',
          route: '/(tabs)/profile',
          icon: 'person.fill',
          label: 'Profile',
        },
      ];
    }

    return [
      ...baseTabs,
      {
        name: 'profile',
        route: '/(tabs)/profile',
        icon: 'person.fill',
        label: 'Profile',
      },
    ];
  };

  const tabs = getTabsForRole();

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        {tabs.map((tab) => (
          <NativeTabs.Trigger key={tab.name} name={tab.name}>
            <Icon sf={tab.icon} drawable={`ic_${tab.name}`} />
            <Label>{tab.label}</Label>
          </NativeTabs.Trigger>
        ))}
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="students" />
        <Stack.Screen name="tutors" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="payments" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="materials" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
