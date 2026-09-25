/**
 * Lawyer Dashboard – app/marketplace/dashboard.tsx
 * Only reachable when isVerifiedLawyer === true.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  Check,
  X,
  Clock,
  CheckCircle2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  ShieldCheck,
  Home,
  AlertTriangle,
  FileText,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, CONTENT_MAX_WIDTH } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import type { ConsultationRequest, ConsultationStatus, LawyerProfile } from '../../types/marketplace';
import { PRACTICE_AREA_LABELS, PRACTICE_AREA_LABELS as PAL } from '../../types/marketplace';
import { SkeletonPulse } from '../../components/LoadingState';

const STATUS_CFG: Record<ConsultationStatus, { label: string; color: string; Icon: any }> = {
  pending: { label: 'Pending', color: '#F59E0B', Icon: Clock },
  accepted: { label: 'Accepted', color: '#10B981', Icon: Check },
  declined: { label: 'Declined', color: '#EF4444', Icon: X },
  completed: { label: 'Completed', color: '#6366F1', Icon: CheckCircle2 },
};

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({
  lawyer,
  onSave,
  onClose,
}: {
  lawyer: LawyerProfile;
  onSave: (bio: string, firm: string) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const [bio, setBio] = useState(lawyer.bio);
  const [firm, setFirm] = useState(lawyer.firmOrChambers ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await marketplaceService.updateLawyerProfile(lawyer.id, { bio, firmOrChambers: firm });
      onSave(bio, firm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[epSt.modal, { backgroundColor: colors.background }]}>
        <View style={[epSt.header, { borderBottomColor: colors.border }]}>
          <Text style={[epSt.title, { color: colors.text }]}>Edit Profile</Text>
          <TouchableOpacity style={[epSt.closeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]} onPress={onClose} accessibilityLabel="Close">
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={epSt.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[epSt.label, { color: colors.text }]}>Bio</Text>
          <View style={[epSt.textArea, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <TextInput
              style={[epSt.textInput, { color: colors.text }]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel="Edit your bio"
            />
          </View>
          <Text style={[epSt.label, { color: colors.text }]}>Firm / Chambers (optional)</Text>
          <View style={[epSt.input, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <TextInput
              style={[epSt.textInput, { color: colors.text }]}
              value={firm}
              onChangeText={setFirm}
              placeholder="e.g. Adeyemi & Co."
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Edit firm or chambers name"
            />
          </View>
          <TouchableOpacity style={[epSt.saveBtn, { backgroundColor: colors.primary }, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving} accessibilityLabel="Save changes">
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={epSt.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
const epSt = StyleSheet.create({
  modal: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '800' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { padding: Spacing.md },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: Spacing.md },
  textArea: { borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.md },
  input: { borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 48 },
  textInput: { fontSize: 14, lineHeight: 22, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  saveBtn: { marginTop: Spacing.lg, borderRadius: BorderRadius.pill, paddingVertical: 16, alignItems: 'center', ...Shadows.md },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// ─── Request Card ─────────────────────────────────────────────────────────────

function IncomingRequestCard({
  req,
  onAccept,
  onDecline,
}: {
  req: ConsultationRequest;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const { colors } = useTheme();
  const cfg = STATUS_CFG[req.status];
  const Icon = cfg.Icon;
  const date = new Date(req.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });

  return (
    <View style={[irSt.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={irSt.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[irSt.area, { color: colors.primary }]}>{PRACTICE_AREA_LABELS[req.practiceArea]}</Text>
          <Text style={[irSt.date, { color: colors.textMuted }]}>{date} · {req.contactPreference.replace('_', ' ')} · {req.urgency}</Text>
        </View>
        <View style={[irSt.badge, { backgroundColor: cfg.color + '20' }]}>
          <Icon size={11} color={cfg.color} />
          <Text style={[irSt.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={[irSt.desc, { color: colors.textMuted }]} numberOfLines={3}>{req.issueDescription}</Text>
      {req.status === 'pending' && (
        <View style={irSt.actions}>
          <TouchableOpacity
            style={[irSt.btn, { backgroundColor: colors.success }]}
            onPress={onAccept}
            accessibilityLabel="Accept request"
          >
            <Check size={14} color="#fff" />
            <Text style={irSt.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[irSt.btn, { backgroundColor: '#EF4444' }]}
            onPress={onDecline}
            accessibilityLabel="Decline request"
          >
            <X size={14} color="#fff" />
            <Text style={irSt.btnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const irSt = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, ...Shadows.sm },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  area: { fontSize: 14, fontWeight: '800' },
  date: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.pill, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: BorderRadius.pill, gap: 6, minHeight: 44 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { isVerifiedLawyer, hasAppliedAsLawyer, application, isLoadingApplication, currentLawyerId } = useMarketplace();
  const isWide = width > 768;

  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Guard – if user has never applied as a lawyer, redirect to marketplace
  useEffect(() => {
    if (!isLoadingApplication && !hasAppliedAsLawyer && !isVerifiedLawyer && !application) {
      router.replace('/(tabs)/marketplace' as any);
    }
  }, [isLoadingApplication, hasAppliedAsLawyer, isVerifiedLawyer, application, router]);

  const fetchData = useCallback(async () => {
    try {
      const [reqs, lawyerProfile] = await Promise.all([
        marketplaceService.listIncomingRequests(),
        currentLawyerId ? marketplaceService.getLawyer(currentLawyerId) : Promise.resolve(null),
      ]);
      setRequests(reqs);
      setLawyer(lawyerProfile);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [currentLawyerId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAccept = async (reqId: string) => {
    try {
      const updated = await marketplaceService.respondToRequest(reqId, 'accept');
      setRequests((prev) => prev.map((r) => (r.id === reqId ? updated : r)));
    } catch {
      Alert.alert('Error', 'Could not accept request. Please try again.');
    }
  };

  const handleDecline = (reqId: string) => {
    Alert.alert('Decline Request', 'Are you sure you want to decline this consultation request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = await marketplaceService.respondToRequest(reqId, 'decline', 'Unfortunately I am not available at this time.');
            setRequests((prev) => prev.map((r) => (r.id === reqId ? updated : r)));
          } catch {
            Alert.alert('Error', 'Could not decline request.');
          }
        },
      },
    ]);
  };

  const handleAvailability = async (value: boolean) => {
    if (!lawyer) return;
    const updated = await marketplaceService.setAvailability(lawyer.id, value);
    setLawyer(updated);
  };

  const activeStatus = application?.status ?? (isVerifiedLawyer ? 'verified' : 'under_review');

  const displayLawyer: LawyerProfile = lawyer ?? {
    id: application?.id || 'lawyer_001',
    fullName: application?.personal?.fullName || 'Barrister Counsel',
    scnNumber: application?.credentials?.scnNumber || 'SCN/LAG/0048291',
    yearOfCall: application?.credentials?.yearOfCall || 2018,
    yearsOfExperience: application?.credentials?.yearsOfExperience || 6,
    practiceAreas: application?.credentials?.practiceAreas || ['tenancy_land', 'police_human_rights'],
    city: application?.personal?.city || 'Lagos',
    state: application?.personal?.state || 'Lagos',
    bio: application?.personal?.bio || 'Dedicated legal practitioner on Rights Compass.',
    firmOrChambers: application?.credentials?.firmOrChambers,
    applicationStatus: activeStatus,
    isAvailable: isVerifiedLawyer,
    rating: 5.0,
    consultationsCompleted: 0,
  };

  const getStatusConfig = () => {
    switch (activeStatus) {
      case 'verified':
        return {
          label: 'VERIFIED PRACTITIONER',
          headline: 'Your Profile is Live in Directory',
          sub: 'Citizens can find your profile and request paid legal consultations.',
          color: '#10B981',
          bg: '#10B98115',
          border: '#10B98140',
          Icon: ShieldCheck,
        };
      case 'rejected':
        return {
          label: 'ACTION REQUIRED',
          headline: 'Application Requires Update',
          sub: application?.rejectionReason || 'Please review your credentials or documents and re-submit for verification.',
          color: '#EF4444',
          bg: '#EF444415',
          border: '#EF444440',
          Icon: AlertTriangle,
        };
      case 'submitted':
      case 'under_review':
      default:
        return {
          label: 'APPLICATION UNDER REVIEW',
          headline: 'Credentials Verification in Progress',
          sub: 'Your Supreme Court enrolment & Call to Bar are being authenticated. You can use all features of the main app while review is ongoing.',
          color: '#D97706',
          bg: '#FEF3C725',
          border: '#F59E0B40',
          Icon: Clock,
        };
    }
  };

  const statusCfg = getStatusConfig();
  const pending = requests.filter((r) => r.status === 'pending').length;

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)' as any)}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[st.title, { color: colors.text }]}>Lawyer Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.primary} />}
      >
        {/* Verification Status Card */}
        <View style={[st.statusCard, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
          <View style={st.statusHeaderRow}>
            <View style={[st.statusBadge, { backgroundColor: statusCfg.color + '20' }]}>
              <statusCfg.Icon size={14} color={statusCfg.color} />
              <Text style={[st.statusBadgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </View>
            <Text style={[st.statusTime, { color: colors.textMuted }]}>
              {activeStatus === 'verified' ? 'Active Status' : 'Pending Review'}
            </Text>
          </View>
          <Text style={[st.statusTitle, { color: colors.text }]}>{statusCfg.headline}</Text>
          <Text style={[st.statusDesc, { color: colors.textMuted }]}>{statusCfg.sub}</Text>

          {/* Credential summary row */}
          <View style={[st.credSummaryRow, { borderTopColor: colors.border }]}>
            <View style={st.credItem}>
              <Text style={[st.credLabel, { color: colors.textMuted }]}>Enrolment No.</Text>
              <Text style={[st.credVal, { color: colors.text }]} numberOfLines={1}>{displayLawyer.scnNumber}</Text>
            </View>
            <View style={st.credItem}>
              <Text style={[st.credLabel, { color: colors.textMuted }]}>Year of Call</Text>
              <Text style={[st.credVal, { color: colors.text }]}>{displayLawyer.yearOfCall}</Text>
            </View>
            <View style={st.credItem}>
              <Text style={[st.credLabel, { color: colors.textMuted }]}>Practice Areas</Text>
              <Text style={[st.credVal, { color: colors.text }]}>{displayLawyer.practiceAreas.length} selected</Text>
            </View>
          </View>

          {/* Link to status details */}
          <TouchableOpacity
            style={[st.statusDetailsBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => router.push('/lawyer-application/status' as any)}
            accessibilityLabel="View full application status and documents"
          >
            <FileText size={14} color={colors.primary} />
            <Text style={[st.statusDetailsBtnText, { color: colors.primary }]}>Application Documents & Timeline</Text>
            <ChevronRight size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[st.profileCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[st.avatar, { backgroundColor: colors.primary }]}>
            <Text style={st.avatarText}>
              {displayLawyer.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[st.profileName, { color: colors.text }]}>{displayLawyer.fullName}</Text>
            <Text style={[st.profileSub, { color: colors.textMuted }]}>
              {displayLawyer.city}, {displayLawyer.state} {displayLawyer.firmOrChambers ? `• ${displayLawyer.firmOrChambers}` : ''}
            </Text>
            <View style={st.practiceChipsRow}>
              {displayLawyer.practiceAreas.slice(0, 3).map((area) => (
                <View key={area} style={[st.practiceChip, { backgroundColor: colors.accentLight }]}>
                  <Text style={[st.practiceChipText, { color: colors.primary }]}>
                    {PRACTICE_AREA_LABELS[area] || area}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[st.editBtn, { backgroundColor: colors.accentLight, borderColor: colors.border }]}
            onPress={() => setShowEditModal(true)}
            accessibilityLabel="Edit profile"
          >
            <Edit3 size={15} color={colors.primary} />
            <Text style={[st.editBtnText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Availability Card */}
        <View style={[st.availCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[st.availTitle, { color: colors.text }]}>
              {isVerifiedLawyer
                ? (displayLawyer.isAvailable ? 'Available for Consultations' : 'Currently Unavailable')
                : 'Consultation Availability'}
            </Text>
            <Text style={[st.availSub, { color: colors.textMuted }]}>
              {isVerifiedLawyer
                ? (displayLawyer.isAvailable ? 'You appear in the directory and can receive requests.' : 'You are hidden from new consultation requests.')
                : 'Availability toggle will activate once your credentials review is completed.'}
            </Text>
          </View>
          <Switch
            value={isVerifiedLawyer ? displayLawyer.isAvailable : false}
            onValueChange={isVerifiedLawyer ? handleAvailability : undefined}
            disabled={!isVerifiedLawyer}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Toggle availability"
          />
        </View>

        {/* Requests Section */}
        <View style={st.sectionHeader}>
          <Text style={[st.sectionTitle, { color: colors.text }]}>Consultation Requests</Text>
          {pending > 0 && (
            <View style={[st.pendingBadge, { backgroundColor: colors.primary }]}>
              <Text style={st.pendingBadgeText}>{pending} pending</Text>
            </View>
          )}
        </View>

        {loading && (
          <>
            {[1, 2].map((i) => (
              <View key={i} style={[irSt.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <SkeletonPulse style={{ height: 14, width: '40%', borderRadius: 4, marginBottom: 8 }} />
                <SkeletonPulse style={{ height: 12, width: '80%', borderRadius: 4, marginBottom: 12 }} />
                <SkeletonPulse style={{ height: 40, width: '100%', borderRadius: BorderRadius.pill }} />
              </View>
            ))}
          </>
        )}

        {!loading && requests.length === 0 && (
          <View style={[st.emptyBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <MessageSquare size={36} color={colors.textMuted} />
            <Text style={[st.emptyTitle, { color: colors.text }]}>
              {isVerifiedLawyer ? 'No requests yet' : 'Inquiries Awaiting Verification'}
            </Text>
            <Text style={[st.emptySub, { color: colors.textMuted }]}>
              {isVerifiedLawyer
                ? 'Client consultation requests will appear here.'
                : 'Paid consultation requests from citizens seeking legal help will arrive here once your credentials are confirmed.'}
            </Text>
          </View>
        )}

        {!loading && requests.map((req) => (
          <IncomingRequestCard
            key={req.id}
            req={req}
            onAccept={() => handleAccept(req.id)}
            onDecline={() => handleDecline(req.id)}
          />
        ))}

        <View style={[st.footerDis, { borderTopColor: colors.border }]}>
          <Text style={[st.footerDisText, { color: colors.textMuted }]}>
            Rights Compass is not a law firm and does not provide legal representation. Consultations are between clients and independent practitioners.
          </Text>
        </View>
      </ScrollView>

      {showEditModal && (
        <EditProfileModal
          lawyer={displayLawyer}
          onSave={(bio, firm) => {
            setLawyer((prev) => prev ? { ...prev, bio, firmOrChambers: firm } : { ...displayLawyer, bio, firmOrChambers: firm });
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  wideScroll: { maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', width: '100%' },

  /* Status Card */
  statusCard: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, ...Shadows.sm },
  statusHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.pill, gap: 5 },
  statusBadgeText: { fontSize: 11, fontWeight: '800' },
  statusTime: { fontSize: 12, fontWeight: '600' },
  statusTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  statusDesc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  credSummaryRow: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 10, marginBottom: 10, gap: 12 },
  credItem: { flex: 1 },
  credLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  credVal: { fontSize: 13, fontWeight: '700' },
  statusDetailsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1 },
  statusDetailsBtnText: { fontSize: 12, fontWeight: '700', flex: 1, marginLeft: 8 },

  /* Profile Card */
  profileCard: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, ...Shadows.sm, gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  profileName: { fontSize: 16, fontWeight: '800' },
  profileSub: { fontSize: 13, marginTop: 2, marginBottom: 6 },
  practiceChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  practiceChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.sm },
  practiceChipText: { fontSize: 10, fontWeight: '700' },
  editBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.pill, borderWidth: 1, gap: 6, minHeight: 40 },
  editBtnText: { fontSize: 13, fontWeight: '700' },

  /* Availability */
  availCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, gap: 12 },
  availTitle: { fontSize: 14, fontWeight: '700' },
  availSub: { fontSize: 12, marginTop: 2, lineHeight: 17 },

  /* Requests */
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  pendingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.pill },
  pendingBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  emptyBox: { borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  footerDis: { paddingTop: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  footerDisText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
