/**
 * Step 3 – Documents
 * app/lawyer-application/documents.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ArrowLeft, Upload, X, CheckCircle2, ChevronRight, FileText, AlertCircle } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import { REQUIRED_DOCUMENTS } from '../../config/requiredDocuments';
import type { ApplicationDocument } from '../../types/marketplace';
import { ApplicationProgress } from './ApplicationProgress';

export default function DocumentsStep() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { application, refreshApplication } = useMarketplace();
  const isWide = width > 768;

  // Map: docId → uploaded document
  const [uploaded, setUploaded] = useState<Record<string, ApplicationDocument>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application?.documents) {
      const map: Record<string, ApplicationDocument> = {};
      application.documents.forEach((d) => { map[d.id] = d; });
      setUploaded(map);
    }
  }, [application]);

  const allRequiredUploaded = REQUIRED_DOCUMENTS.filter((d) => d.required).every((d) => uploaded[d.id]);

  const pickDocument = async (docId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.fileName ?? `${docId}_${Date.now()}.jpg`;
      const doc: ApplicationDocument = {
        id: docId,
        fileName,
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      };
      setUploaded((prev) => ({ ...prev, [docId]: doc }));
    }
  };

  const removeDocument = (docId: string) => {
    setUploaded((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const handleNext = async () => {
    if (!allRequiredUploaded || saving) return;
    setSaving(true);
    try {
      await marketplaceService.saveApplicationDraft({
        ...application,
        currentStep: 3,
        documents: Object.values(uploaded),
      });
      await refreshApplication();
      router.push('/lawyer-application/review' as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[st.title, { color: colors.text }]}>Lawyer Application</Text>
          <Text style={[st.subtitle, { color: colors.textMuted }]}>Step 3 of 4 – Documents</Text>
        </View>
      </View>

      <ApplicationProgress currentStep={2} />

      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[st.sectionHeader, { color: colors.text }]}>Upload Documents</Text>
        <Text style={[st.sectionSub, { color: colors.textMuted }]}>
          Upload clear, legible scans or photos of each document. Accepted: JPG, PNG, PDF.
        </Text>

        {/* Info banner */}
        <View style={[st.infoBanner, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
          <AlertCircle size={14} color={colors.primary} />
          <Text style={[st.infoBannerText, { color: colors.primary }]}>
            All uploaded documents are stored locally on your device and will only be shared with our verification team upon submission.
          </Text>
        </View>

        {REQUIRED_DOCUMENTS.map((doc) => {
          const uploading = false;
          const done = !!uploaded[doc.id];

          return (
            <View
              key={doc.id}
              style={[st.docCard, { backgroundColor: colors.cardBackground, borderColor: done ? colors.success : colors.border, borderWidth: done ? 2 : 1 }]}
            >
              {/* Card header */}
              <View style={st.docHeader}>
                <View style={[st.docIconCircle, { backgroundColor: done ? colors.success + '20' : colors.accentLight }]}>
                  {done ? <CheckCircle2 size={20} color={colors.success} /> : <FileText size={20} color={colors.primary} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[st.docLabel, { color: colors.text }]}>{doc.label}</Text>
                    {doc.required && <Text style={[st.required, { color: colors.primary }]}>Required</Text>}
                  </View>
                  <Text style={[st.docDesc, { color: colors.textMuted }]}>{doc.description}</Text>
                </View>
              </View>

              {/* Preview */}
              {done && uploaded[doc.id] && (
                <View style={[st.previewBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  {uploaded[doc.id].mimeType?.startsWith('image') ? (
                    <Image
                      source={{ uri: uploaded[doc.id].uri }}
                      style={st.previewImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={st.pdfPreview}>
                      <FileText size={28} color={colors.primary} />
                      <Text style={[st.pdfFileName, { color: colors.text }]} numberOfLines={1}>
                        {uploaded[doc.id].fileName}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[st.removeBtn, { backgroundColor: '#EF4444' }]}
                    onPress={() => removeDocument(doc.id)}
                    accessibilityLabel={`Remove ${doc.label}`}
                  >
                    <X size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Upload / Replace button */}
              <TouchableOpacity
                style={[
                  st.uploadBtn,
                  { backgroundColor: done ? colors.cardBackground : colors.primary, borderColor: done ? colors.border : colors.primary, borderWidth: 1 },
                ]}
                onPress={() => pickDocument(doc.id)}
                accessibilityLabel={done ? `Replace ${doc.label}` : `Upload ${doc.label}`}
                accessibilityHint="Opens your photo and file library"
              >
                <Upload size={15} color={done ? colors.textMuted : '#fff'} />
                <Text style={[st.uploadBtnText, { color: done ? colors.textMuted : '#fff' }]}>
                  {done ? 'Replace' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Next */}
        <TouchableOpacity
          style={[st.nextBtn, { backgroundColor: colors.primary }, (!allRequiredUploaded || saving) && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={!allRequiredUploaded || saving}
          accessibilityLabel="Continue to review"
          accessibilityHint={!allRequiredUploaded ? 'Please upload all required documents' : undefined}
        >
          {saving ? <ActivityIndicator color="#fff" /> : (
            <>
              <Text style={st.nextBtnText}>Review Application</Text>
              <ChevronRight size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  wideScroll: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  sectionHeader: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sectionSub: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.md },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, gap: 8 },
  infoBannerText: { flex: 1, fontSize: 12, lineHeight: 18 },
  docCard: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  docHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: Spacing.md },
  docIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  docLabel: { fontSize: 14, fontWeight: '800' },
  required: { fontSize: 11, fontWeight: '800', paddingHorizontal: 7, paddingVertical: 2, borderRadius: BorderRadius.pill, backgroundColor: 'rgba(150, 62, 20, 0.12)' },
  docDesc: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  previewBox: { borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.md, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: 160 },
  pdfPreview: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: 10 },
  pdfFileName: { flex: 1, fontSize: 13, fontWeight: '600' },
  removeBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.md, paddingVertical: 12, gap: 8, minHeight: 44 },
  uploadBtnText: { fontSize: 14, fontWeight: '700' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, marginTop: Spacing.lg, gap: 8, ...Shadows.md },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
