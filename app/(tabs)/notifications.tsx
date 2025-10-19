
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import { mockStudents, mockAdminNotifications } from '@/data/mockData';
import { AdminNotification } from '@/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 8,
    zIndex: 1000,
  },
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  recipientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  recipientChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  recipientChipSelected: {
    backgroundColor: colors.primary,
  },
  recipientChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  recipientChipTextSelected: {
    color: colors.card,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  priorityOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  priorityOptionTextSelected: {
    color: colors.card,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [showModal, setShowModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['all']);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notificationType, setNotificationType] = useState<'admin_message' | 'payment_reminder' | 'general_announcement'>('general_announcement');

  const parents = mockStudents.map(student => ({
    id: student.id,
    name: student.parentName,
    email: student.parentEmail,
  }));

  const handleRecipientToggle = (recipientId: string) => {
    if (recipientId === 'all') {
      setSelectedRecipients(['all']);
    } else {
      setSelectedRecipients(prev => {
        const filtered = prev.filter(id => id !== 'all');
        if (filtered.includes(recipientId)) {
          return filtered.filter(id => id !== recipientId);
        } else {
          return [...filtered, recipientId];
        }
      });
    }
  };

  const handleSendNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedRecipients.length === 0) {
      Alert.alert('Error', 'Please select at least one recipient');
      return;
    }

    const newNotification: AdminNotification = {
      id: Date.now().toString(),
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      recipients: selectedRecipients,
      sentBy: user?.email || 'admin',
      sentDate: new Date().toISOString(),
      priority,
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    const recipientCount = selectedRecipients.includes('all') 
      ? parents.length 
      : selectedRecipients.length;

    Alert.alert(
      'Success',
      `Notification sent to ${recipientCount} parent${recipientCount > 1 ? 's' : ''}!`
    );

    console.log('Notification sent:', newNotification);

    // Reset form
    setNotificationTitle('');
    setNotificationMessage('');
    setSelectedRecipients(['all']);
    setPriority('medium');
    setNotificationType('general_announcement');
    setShowModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (user?.role !== 'admin') {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Stack.Screen options={{ title: 'Notifications' }} />
        <IconSymbol name="lock.fill" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={commonStyles.subtitle}>Access Denied</Text>
        <Text style={commonStyles.textSecondary}>Only administrators can send notifications.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Parent Notifications' }} />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={commonStyles.title}>Parent Notifications</Text>
          <Text style={commonStyles.textSecondary}>
            Send notifications and reminders to parents
          </Text>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="bell.slash.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No notifications sent yet</Text>
            <Text style={commonStyles.textSecondary}>
              Tap the + button to send your first notification
            </Text>
          </View>
        ) : (
          notifications.map(notification => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notification.priority) }]}>
                  <Text style={styles.priorityText}>{notification.priority.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              
              <Text style={styles.notificationMeta}>
                Sent to: {notification.recipients.includes('all') 
                  ? `All parents (${parents.length})` 
                  : `${notification.recipients.length} parent${notification.recipients.length > 1 ? 's' : ''}`}
              </Text>
              <Text style={styles.notificationMeta}>
                {formatDate(notification.sentDate)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <IconSymbol name="plus" size={28} color={colors.card} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Send Notification</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notification Type</Text>
                <View style={styles.prioritySelector}>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      notificationType === 'general_announcement' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setNotificationType('general_announcement')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      notificationType === 'general_announcement' && styles.priorityOptionTextSelected,
                    ]}>
                      General
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      notificationType === 'payment_reminder' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setNotificationType('payment_reminder')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      notificationType === 'payment_reminder' && styles.priorityOptionTextSelected,
                    ]}>
                      Payment
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      notificationType === 'admin_message' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setNotificationType('admin_message')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      notificationType === 'admin_message' && styles.priorityOptionTextSelected,
                    ]}>
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={notificationTitle}
                  onChangeText={setNotificationTitle}
                  placeholder="Enter notification title"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notificationMessage}
                  onChangeText={setNotificationMessage}
                  placeholder="Enter your message to parents"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipients</Text>
                <View style={styles.recipientSelector}>
                  <TouchableOpacity
                    style={[
                      styles.recipientChip,
                      selectedRecipients.includes('all') && styles.recipientChipSelected,
                    ]}
                    onPress={() => handleRecipientToggle('all')}
                  >
                    <Text style={[
                      styles.recipientChipText,
                      selectedRecipients.includes('all') && styles.recipientChipTextSelected,
                    ]}>
                      All Parents ({parents.length})
                    </Text>
                  </TouchableOpacity>
                  {parents.map(parent => (
                    <TouchableOpacity
                      key={parent.id}
                      style={[
                        styles.recipientChip,
                        selectedRecipients.includes(parent.id) && styles.recipientChipSelected,
                      ]}
                      onPress={() => handleRecipientToggle(parent.id)}
                    >
                      <Text style={[
                        styles.recipientChipText,
                        selectedRecipients.includes(parent.id) && styles.recipientChipTextSelected,
                      ]}>
                        {parent.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.prioritySelector}>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'low' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setPriority('low')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      priority === 'low' && styles.priorityOptionTextSelected,
                    ]}>
                      Low
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'medium' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setPriority('medium')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      priority === 'medium' && styles.priorityOptionTextSelected,
                    ]}>
                      Medium
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      priority === 'high' && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setPriority('high')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      priority === 'high' && styles.priorityOptionTextSelected,
                    ]}>
                      High
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, buttonStyles.outline]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={commonStyles.outlineButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, buttonStyles.primary]}
                  onPress={handleSendNotification}
                >
                  <Text style={commonStyles.buttonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
