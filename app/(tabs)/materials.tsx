
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

interface Material {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: 'notes' | 'assignment' | 'practice' | 'exam';
  uploadedBy: string;
  uploadDate: string;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
}

const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Algebra Basics - Chapter 1',
    subject: 'Mathematics',
    grade: 'Grade 10',
    type: 'notes',
    uploadedBy: 'Mr. Nkosi',
    uploadDate: '2024-03-15',
    fileName: 'algebra_chapter1.pdf',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    title: 'Quadratic Equations Practice',
    subject: 'Mathematics',
    grade: 'Grade 10',
    type: 'practice',
    uploadedBy: 'Mr. Nkosi',
    uploadDate: '2024-03-14',
    fileName: 'quadratic_practice.pdf',
    fileSize: '1.8 MB',
  },
  {
    id: '3',
    title: 'Physics Assignment 3',
    subject: 'Physical Science',
    grade: 'Grade 11',
    type: 'assignment',
    uploadedBy: 'Mrs. Dlamini',
    uploadDate: '2024-03-13',
    fileName: 'physics_assignment3.pdf',
    fileSize: '1.2 MB',
  },
  {
    id: '4',
    title: 'Mid-Term Exam Paper',
    subject: 'Mathematics',
    grade: 'Grade 10',
    type: 'exam',
    uploadedBy: 'Mr. Nkosi',
    uploadDate: '2024-03-10',
    fileName: 'midterm_exam.pdf',
    fileSize: '3.1 MB',
  },
];

export default function MaterialsScreen() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'notes' | 'assignment' | 'practice' | 'exam'>('all');
  
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    grade: '',
    type: 'notes' as 'notes' | 'assignment' | 'practice' | 'exam',
    fileName: '',
    fileUri: '',
  });

  const handlePickDocument = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setNewMaterial(prev => ({
          ...prev,
          fileName: asset.fileName || 'document.pdf',
          fileUri: asset.uri,
        }));
        Alert.alert('Success', 'File selected successfully!');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const handleUpload = () => {
    if (!newMaterial.title || !newMaterial.subject || !newMaterial.grade || !newMaterial.fileUri) {
      Alert.alert('Error', 'Please fill in all fields and select a file.');
      return;
    }

    const material: Material = {
      id: Date.now().toString(),
      title: newMaterial.title,
      subject: newMaterial.subject,
      grade: newMaterial.grade,
      type: newMaterial.type,
      uploadedBy: user?.name || 'Unknown',
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: newMaterial.fileName,
      fileUri: newMaterial.fileUri,
      fileSize: '1.5 MB',
    };

    setMaterials(prev => [material, ...prev]);
    setShowUploadModal(false);
    setNewMaterial({
      title: '',
      subject: '',
      grade: '',
      type: 'notes',
      fileName: '',
      fileUri: '',
    });

    Alert.alert('Success', 'Material uploaded successfully!');
    console.log('Material uploaded:', material);
  };

  const handleDownload = (material: Material) => {
    Alert.alert(
      'Download Material',
      `Download ${material.fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            console.log('Downloading:', material);
            Alert.alert('Success', 'Material downloaded successfully!');
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notes':
        return 'doc.text.fill';
      case 'assignment':
        return 'pencil.and.list.clipboard';
      case 'practice':
        return 'book.fill';
      case 'exam':
        return 'doc.badge.gearshape';
      default:
        return 'doc.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notes':
        return colors.primary;
      case 'assignment':
        return colors.warning;
      case 'practice':
        return colors.secondary;
      case 'exam':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const filteredMaterials = selectedFilter === 'all'
    ? materials
    : materials.filter(m => m.type === selectedFilter);

  const renderUploadModal = () => (
    <Modal
      visible={showUploadModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowUploadModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={commonStyles.title}>Upload Material</Text>
          <TouchableOpacity onPress={() => setShowUploadModal(false)}>
            <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} contentContainerStyle={commonStyles.scrollContent}>
          <View style={commonStyles.card}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Algebra Basics - Chapter 1"
              placeholderTextColor={colors.textSecondary}
              value={newMaterial.title}
              onChangeText={(text) => setNewMaterial(prev => ({ ...prev, title: text }))}
            />

            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics"
              placeholderTextColor={colors.textSecondary}
              value={newMaterial.subject}
              onChangeText={(text) => setNewMaterial(prev => ({ ...prev, subject: text }))}
            />

            <Text style={styles.label}>Grade *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grade 10"
              placeholderTextColor={colors.textSecondary}
              value={newMaterial.grade}
              onChangeText={(text) => setNewMaterial(prev => ({ ...prev, grade: text }))}
            />

            <Text style={styles.label}>Type *</Text>
            <View style={styles.typeButtons}>
              {(['notes', 'assignment', 'practice', 'exam'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newMaterial.type === type && {
                      backgroundColor: getTypeColor(type),
                    },
                  ]}
                  onPress={() => setNewMaterial(prev => ({ ...prev, type }))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newMaterial.type === type && { color: colors.card },
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>File *</Text>
            <TouchableOpacity
              style={styles.filePickerButton}
              onPress={handlePickDocument}
            >
              <IconSymbol name="doc.badge.plus" size={24} color={colors.primary} />
              <Text style={styles.filePickerText}>
                {newMaterial.fileName || 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.uploadButton]}
            onPress={handleUpload}
          >
            <Text style={buttonStyles.primaryText}>Upload Material</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Study Materials',
          headerLargeTitle: Platform.OS === 'ios',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={commonStyles.scrollContent}>
          {user?.role === 'tutor' && (
            <TouchableOpacity
              style={[buttonStyles.primary, styles.uploadButtonTop]}
              onPress={() => setShowUploadModal(true)}
            >
              <IconSymbol name="arrow.up.doc.fill" size={20} color={colors.card} />
              <Text style={buttonStyles.primaryText}>Upload New Material</Text>
            </TouchableOpacity>
          )}

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Filter by Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === 'all' && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter('all')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === 'all' && styles.filterButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              {(['notes', 'assignment', 'practice', 'exam'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    selectedFilter === type && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedFilter(type)}
                >
                  <IconSymbol
                    name={getTypeIcon(type) as any}
                    size={16}
                    color={selectedFilter === type ? colors.card : getTypeColor(type)}
                  />
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === type && styles.filterButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
              Materials ({filteredMaterials.length})
            </Text>
            {filteredMaterials.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="doc.text" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 12 }]}>
                  No materials found
                </Text>
              </View>
            ) : (
              filteredMaterials.map((material) => (
                <TouchableOpacity
                  key={material.id}
                  style={styles.materialItem}
                  onPress={() => handleDownload(material)}
                >
                  <View
                    style={[
                      styles.materialIcon,
                      { backgroundColor: getTypeColor(material.type) },
                    ]}
                  >
                    <IconSymbol
                      name={getTypeIcon(material.type) as any}
                      size={24}
                      color={colors.card}
                    />
                  </View>

                  <View style={styles.materialInfo}>
                    <Text style={styles.materialTitle}>{material.title}</Text>
                    <Text style={commonStyles.textSecondary}>
                      {material.subject} • {material.grade}
                    </Text>
                    <View style={styles.materialMeta}>
                      <Text style={styles.metaText}>
                        {material.uploadedBy} • {new Date(material.uploadDate).toLocaleDateString('en-ZA')}
                      </Text>
                      {material.fileSize && (
                        <Text style={styles.metaText}> • {material.fileSize}</Text>
                      )}
                    </View>
                  </View>

                  <IconSymbol name="arrow.down.circle.fill" size={24} color={colors.primary} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        {renderUploadModal()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  uploadButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  filterScroll: {
    marginTop: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  materialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  materialMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    gap: 12,
  },
  filePickerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  uploadButton: {
    marginTop: 24,
  },
});
