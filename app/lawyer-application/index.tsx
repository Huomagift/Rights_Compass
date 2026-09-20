/**
 * Step 1 – Personal Information
 * app/lawyer-application/index.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  FileText,
  Check,
  ChevronRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import { getStoredProfile } from '../../services/offlineStorage';
import { ApplicationProgress } from './ApplicationProgress';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
];

export default function PersonalStep() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { application, refreshApplication } = useMarketplace();
  const isWide = width > 768;

  const [fullName, setFullName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  // If lawyer has already submitted an application, route them to the main app home
  useEffect(() => {
    if (application?.status && application.status !== 'draft' && application.status !== 'rejected') {
      router.replace('/(tabs)' as any);
    }
  }, [application?.status]);

  // Prefill from existing application or user profile
  useEffect(() => {
    const prefill = async () => {
      if (application?.personal) {
        const p = application.personal;
        setFullName(p.fullName);
        setCity(p.city);
        setState(p.state);
        setBio(p.bio);
        if (p.photoUri) setPhotoUri(p.photoUri);
      } else {
        const profile = await getStoredProfile();
        if (profile.name) setFullName(profile.name);
      }
    };
    prefill();
  }, [application]);

  const isValid = fullName.trim().length > 1 && city.trim().length > 1 && state.length > 0 && bio.trim().length >= 50;

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await marketplaceService.saveApplicationDraft({
        ...application,
        currentStep: 1,
        personal: { fullName: fullName.trim(), photoUri, city: city.trim(), state, bio: bio.trim() },
      });
      await refreshApplication();
      router.push('/lawyer-application/credentials' as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
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
            <Text style={[st.subtitle, { color: colors.textMuted }]}>Step 1 of 4 – Personal Info</Text>
          </View>
        </View>

        <ApplicationProgress currentStep={0} />

        <ScrollView
          contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[st.sectionHeader, { color: colors.text }]}>Tell us about yourself</Text>
          <Text style={[st.sectionSub, { color: colors.textMuted }]}>
            This information will be visible to users who browse the directory.
          </Text>

          {/* Photo */}
          <View style={st.photoRow}>
            <TouchableOpacity
              style={[st.photoCircle, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={pickPhoto}
              accessibilityLabel="Upload profile photo"
              accessibilityHint="Opens your photo library"
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={st.photo} contentFit="cover" />
              ) : (
                <User size={32} color={colors.textMuted} />
              )}
              <View style={[st.cameraOverlay, { backgroundColor: colors.primary }]}>
                <Camera size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[st.photoHint, { color: colors.textMuted }]}>
              Profile photo{'\n'}(optional but recommended)
            </Text>
          </View>

          {/* Full Name */}
          <Text style={[st.label, { color: colors.text }]}>Full Legal Name <Text style={{ color: colors.primary }}>*</Text></Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <User size={16} color={colors.primary} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Adaeze Okonkwo"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              accessibilityLabel="Full legal name"
            />
            {fullName.trim().length > 1 && <Check size={14} color={colors.success} />}
          </View>

          {/* City */}
          <Text style={[st.label, { color: colors.text }]}>City <Text style={{ color: colors.primary }}>*</Text></Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <MapPin size={16} color={colors.primary} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Lagos"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              accessibilityLabel="City"
            />
          </View>

          {/* State */}
          <Text style={[st.label, { color: colors.text }]}>State <Text style={{ color: colors.primary }}>*</Text></Text>
          <TouchableOpacity
            style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => setShowStatePicker(!showStatePicker)}
            accessibilityLabel="Select state"
            accessibilityRole="button"
          >
            <MapPin size={16} color={colors.primary} />
            <Text style={[{ flex: 1, fontSize: 14, marginLeft: 8 }, { color: state ? colors.text : colors.textMuted }]}>
              {state || 'Select a state…'}
            </Text>
          </TouchableOpacity>
          {showStatePicker && (
            <View style={[st.dropdown, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                {NIGERIAN_STATES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[st.dropdownItem, { borderBottomColor: colors.border }, state === s && { backgroundColor: colors.accentLight }]}
                    onPress={() => { setState(s); setShowStatePicker(false); }}
                    accessibilityRole="menuitem"
                  >
                    <Text style={[st.dropdownText, { color: state === s ? colors.primary : colors.text }]}>{s}</Text>
                    {state === s && <Check size={14} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bio */}
          <Text style={[st.label, { color: colors.text }]}>Short Bio <Text style={{ color: colors.primary }}>*</Text></Text>
          <Text style={[st.hint, { color: colors.textMuted }]}>Minimum 50 characters. Describe your practice and expertise.</Text>
          <View style={[st.textArea, { backgroundColor: colors.cardBackground, borderColor: bio.trim().length >= 50 ? colors.primary : colors.border }]}>
            <TextInput
              style={[st.textAreaInput, { color: colors.text }]}
              value={bio}
              onChangeText={setBio}
              placeholder="e.g. Senior advocate with 14 years of practice in…"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel="Short professional bio"
            />
          </View>
          <Text style={[st.charCount, { color: bio.trim().length >= 50 ? colors.success : '#EF4444' }]}>
            {bio.trim().length}/50 min characters
          </Text>

          {/* Next */}
          <TouchableOpacity
            style={[st.nextBtn, { backgroundColor: colors.primary }, (!isValid || saving) && { opacity: 0.5 }]}
            onPress={handleNext}
            disabled={!isValid || saving}
            accessibilityLabel="Continue to credentials"
          >
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={st.nextBtnText}>Continue</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionSub: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.lg },
  photoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, gap: 16 },
  photoCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, overflow: 'hidden', position: 'relative' },
  photo: { width: 88, height: 88, borderRadius: 44 },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  photoHint: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: Spacing.md },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: 8, marginTop: -4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 48, gap: 8 },
  input: { flex: 1, fontSize: 14, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  dropdown: { borderRadius: BorderRadius.md, borderWidth: 1, marginTop: 4, marginBottom: Spacing.sm, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownText: { fontSize: 14 },
  textArea: { borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  textAreaInput: { fontSize: 14, lineHeight: 22, minHeight: 120, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  charCount: { fontSize: 12, marginTop: 4, textAlign: 'right', fontWeight: '600' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, marginTop: Spacing.xl, gap: 8, ...Shadows.md },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
