
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import { mockPayments, mockStudents, appSettings, mockProofOfPayments } from '@/data/mockData';
import { Payment, ProofOfPayment } from '@/types';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  proofSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  proofTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  proofItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  proofText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 20,
  },
  bankDetails: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bankDetailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bankDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  uploadOptions: {
    gap: 12,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
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

export default function PaymentsScreen() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [proofOfPayments, setProofOfPayments] = useState<ProofOfPayment[]>(mockProofOfPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `${appSettings.currencySymbol}${amount.toFixed(2)}`;
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos to upload proof of payment.');
        return false;
      }
    }
    return true;
  };

  const handleUploadProof = async (payment: Payment) => {
    setSelectedPayment(payment);
    setShowUploadModal(true);
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleFileSelected(result.assets[0].uri, 'image');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleFileSelected(result.assets[0].uri, 'image');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleFileSelected = (uri: string, type: string) => {
    if (!selectedPayment) return;

    const fileName = `proof_of_payment_${selectedPayment.id}_${Date.now()}.${type === 'image' ? 'jpg' : 'pdf'}`;
    
    const newProof: ProofOfPayment = {
      id: Date.now().toString(),
      paymentId: selectedPayment.id,
      fileName,
      fileUri: uri,
      fileType: type === 'image' ? 'image/jpeg' : 'application/pdf',
      uploadDate: new Date().toISOString(),
      uploadedBy: user?.email || 'parent',
      status: 'pending',
    };

    setProofOfPayments(prev => [...prev, newProof]);
    
    setPayments(prev => prev.map(p => 
      p.id === selectedPayment.id 
        ? { ...p, proofOfPayment: newProof }
        : p
    ));

    Alert.alert(
      'Success',
      'Proof of payment uploaded successfully! The admin will review it shortly.'
    );

    console.log('Proof of payment uploaded:', newProof);
    setShowUploadModal(false);
    setSelectedPayment(null);
  };

  const getProofForPayment = (paymentId: string) => {
    return proofOfPayments.find(p => p.paymentId === paymentId);
  };

  const filteredPayments = isParent
    ? payments.filter(payment => {
        const student = mockStudents.find(s => s.id === payment.studentId);
        return student?.parentEmail === user?.email;
      })
    : payments;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Payments' }} />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Text style={commonStyles.title}>
            {isParent ? 'My Payments' : 'All Payments'}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {isParent 
              ? 'View and manage your payment history' 
              : 'Track all student payments and receipts'}
          </Text>
        </View>

        {filteredPayments.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="creditcard.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No payments found</Text>
          </View>
        ) : (
          filteredPayments.map(payment => {
            const proof = getProofForPayment(payment.id);
            return (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.studentName}>{getStudentName(payment.studentId)}</Text>
                  <Text style={styles.amount}>{formatAmount(payment.amount)}</Text>
                </View>

                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Payment Type</Text>
                  <Text style={styles.paymentValue}>{payment.type}</Text>
                </View>

                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Date</Text>
                  <Text style={styles.paymentValue}>{formatDate(payment.date)}</Text>
                </View>

                {payment.method && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Method</Text>
                    <Text style={styles.paymentValue}>{payment.method}</Text>
                  </View>
                )}

                {payment.receiptNumber && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Receipt #</Text>
                    <Text style={styles.paymentValue}>{payment.receiptNumber}</Text>
                  </View>
                )}

                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                  <Text style={styles.statusText}>{payment.status.toUpperCase()}</Text>
                </View>

                {proof && (
                  <View style={styles.proofSection}>
                    <Text style={styles.proofTitle}>Proof of Payment</Text>
                    <View style={styles.proofItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                      <Text style={styles.proofText}>{proof.fileName}</Text>
                    </View>
                    <View style={styles.proofItem}>
                      <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                      <Text style={styles.proofText}>Uploaded: {formatDate(proof.uploadDate)}</Text>
                    </View>
                    <View style={styles.proofItem}>
                      <IconSymbol 
                        name={proof.status === 'approved' ? 'checkmark.seal.fill' : 'clock.fill'} 
                        size={16} 
                        color={proof.status === 'approved' ? colors.success : colors.warning} 
                      />
                      <Text style={styles.proofText}>
                        Status: {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                )}

                {isParent && payment.status === 'pending' && !proof && (
                  <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={() => handleUploadProof(payment)}
                  >
                    <IconSymbol name="arrow.up.doc.fill" size={20} color={colors.text} />
                    <Text style={styles.uploadButtonText}>Upload Proof of Payment</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showUploadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Proof of Payment</Text>
            
            <Text style={styles.modalText}>
              Please make payment to the following bank account and upload your proof of payment:
            </Text>

            <View style={styles.bankDetails}>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Bank Name</Text>
                <Text style={styles.bankDetailValue}>{appSettings.bankName}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Number</Text>
                <Text style={styles.bankDetailValue}>{appSettings.bankAccountNumber}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Branch Code</Text>
                <Text style={styles.bankDetailValue}>{appSettings.bankBranchCode}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Name</Text>
                <Text style={styles.bankDetailValue}>{appSettings.academyName}</Text>
              </View>
            </View>

            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <IconSymbol name="camera.fill" size={24} color={colors.primary} />
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                <IconSymbol name="photo.fill" size={24} color={colors.primary} />
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, buttonStyles.outline]}
                onPress={() => {
                  setShowUploadModal(false);
                  setSelectedPayment(null);
                }}
              >
                <Text style={commonStyles.outlineButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
