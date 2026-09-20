/**
 * My Requests – app/marketplace/my-requests.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Check,
  X,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, CONTENT_MAX_WIDTH } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import type { ConsultationRequest, ConsultationStatus } from '../../types/marketplace';
import { PRACTICE_AREA_LABELS } from '../../types/marketplace';
import { SkeletonPulse } from '../../components/LoadingState';

const STATUS_CONFIG: Record<ConsultationStatus, { label: string; color: string; Icon: any }> = {
  pending: { label: 'Pending', color: '#F59E0B', Icon: Clock },
  accepted: { label: 'Accepted', color: '#10B981', Icon: Check },
  declined: { label: 'Declined', color: '#EF4444', Icon: X },
  completed: { label: 'Completed', color: '#6366F1', Icon: CheckCircle2 },
};

function RequestCard({ req, onPress }: { req: ConsultationRequest; onPress: () => void }) {
  const { colors } = useTheme();
  const cfg = STATUS_CONFIG[req.status];
  const Icon = cfg.Icon;
  const date = new Date(req.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <TouchableOpacity
      style={[rSt.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Consultation request with ${req.lawyerName}, status ${cfg.label}`}
    >
      <View style={rSt.topRow}>
        <View>
          <Text style={[rSt.lawyerName, { color: colors.text }]}>{req.lawyerName}</Text>
          <Text style={[rSt.area, { color: colors.textMuted }]}>{PRACTICE_AREA_LABELS[req.practiceArea]}</Text>
        </View>
        <View style={[rSt.badge, { backgroundColor: cfg.color + '20' }]}>
          <Icon size={11} color={cfg.color} />
          <Text style={[rSt.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <Text style={[rSt.desc, { color: colors.textMuted }]} numberOfLines={2}>{req.issueDescription}</Text>
      <View style={rSt.bottomRow}>
        <Text style={[rSt.date, { color: colors.textMuted }]}>{date}</Text>
        <ChevronRight size={14} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const rSt = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, ...Shadows.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  lawyerName: { fontSize: 15, fontWeight: '800' },
  area: { fontSize: 12, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.pill, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12 },
});

function RequestDetailModal({ req, onClose }: { req: ConsultationRequest; onClose: () => void }) {
  const { colors } = useTheme();
  const cfg = STATUS_CONFIG[req.status];
  const Icon = cfg.Icon;
  const date = new Date(req.createdAt).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[mSt.modal, { backgroundColor: colors.background }]}>
        <View style={[mSt.header, { borderBottomColor: colors.border }]}>
          <Text style={[mSt.title, { color: colors.text }]}>Request Details</Text>
          <TouchableOpacity
            style={[mSt.closeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={onClose}
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={mSt.scroll} showsVerticalScrollIndicator={false}>
          {/* Status */}
          <View style={[mSt.statusCard, { backgroundColor: cfg.color + '15', borderColor: cfg.color + '40' }]}>
            <Icon size={20} color={cfg.color} />
            <Text style={[mSt.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>

          {req.status === 'declined' && req.declineReason && (
            <View style={[mSt.infoBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
              <Text style={mSt.infoBoxLabel}>Reason for Decline</Text>
              <Text style={mSt.infoBoxValue}>{req.declineReason}</Text>
            </View>
          )}

          <View style={[mSt.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            {[
              ['Lawyer', req.lawyerName],
              ['Practice Area', PRACTICE_AREA_LABELS[req.practiceArea]],
              ['Contact Preference', req.contactPreference.replace('_', ' ')],
              ['Urgency', req.urgency.replace('_', ' ')],
              ['Submitted', date],
            ].map(([label, value]) => (
              <View key={label} style={[mSt.row, { borderBottomColor: colors.border }]}>
                <Text style={[mSt.rowLabel, { color: colors.textMuted }]}>{label}</Text>
                <Text style={[mSt.rowValue, { color: colors.text }]}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={[mSt.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[mSt.sectionTitle, { color: colors.text }]}>Issue Description</Text>
            <Text style={[mSt.descText, { color: colors.textMuted }]}>{req.issueDescription}</Text>
          </View>

          <View style={[mSt.footerDis, { borderTopColor: colors.border }]}>
            <Text style={[mSt.footerDisText, { color: colors.textMuted }]}>
              Rights Compass is not a law firm and does not provide legal representation.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const mSt = StyleSheet.create({
  modal: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '800' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  statusCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, gap: 10 },
  statusText: { fontSize: 16, fontWeight: '800' },
  infoBox: { borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  infoBoxLabel: { fontSize: 12, fontWeight: '800', color: '#DC2626', marginBottom: 4 },
  infoBoxValue: { fontSize: 14, color: '#7F1D1D' },
  section: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  descText: { fontSize: 14, lineHeight: 22 },
  footerDis: { paddingTop: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  footerDisText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MyRequestsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<ConsultationRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await marketplaceService.listMyRequests();
      setRequests(data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const onRefresh = () => { setRefreshing(true); fetchRequests(); };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/marketplace' as any)}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[st.title, { color: colors.text }]}>My Requests</Text>
      </View>

      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[rSt.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <SkeletonPulse style={{ height: 16, width: '50%', borderRadius: 4, marginBottom: 8 }} />
                <SkeletonPulse style={{ height: 12, width: '80%', borderRadius: 4, marginBottom: 12 }} />
                <SkeletonPulse style={{ height: 12, width: '30%', borderRadius: 4 }} />
              </View>
            ))}
          </>
        )}

        {!loading && requests.length === 0 && (
          <View style={[st.emptyBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <MessageSquare size={40} color={colors.textMuted} />
            <Text style={[st.emptyTitle, { color: colors.text }]}>No requests yet</Text>
            <Text style={[st.emptySub, { color: colors.textMuted }]}>
              Browse the directory and request a consultation with a verified lawyer.
            </Text>
            <TouchableOpacity style={[st.browseBtn, { backgroundColor: colors.primary }]} onPress={() => router.replace('/(tabs)/marketplace' as any)}>
              <Text style={st.browseBtnText}>Browse Lawyers</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && requests.map((req) => (
          <RequestCard key={req.id} req={req} onPress={() => setSelected(req)} />
        ))}

        <View style={[st.footerDis, { borderTopColor: colors.border }]}>
          <Text style={[st.footerDisText, { color: colors.textMuted }]}>
            Rights Compass is not a law firm and does not provide legal representation.
          </Text>
        </View>
      </ScrollView>

      {selected && <RequestDetailModal req={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 22, fontWeight: '800' },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  wideScroll: { maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', width: '100%' },
  emptyBox: { borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, gap: 12, marginTop: Spacing.xl },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  browseBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 12, borderRadius: BorderRadius.pill },
  browseBtnText: { color: '#fff', fontWeight: '700' },
  footerDis: { paddingTop: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  footerDisText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
