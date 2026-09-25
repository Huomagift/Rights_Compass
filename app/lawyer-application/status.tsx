/**
 * Application Status Screen – app/lawyer-application/status.tsx
 * Shows the current state of the lawyer application with timeline.
 * DEV-only switcher to test all status states.
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  Clock,
  Search,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Compass,
  Gavel,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import type { LawyerApplicationStatus } from '../../types/marketplace';

// ─── Timeline Data ────────────────────────────────────────────────────────────

interface TimelineItem {
  status: LawyerApplicationStatus;
  label: string;
  description: string;
}

const TIMELINE: TimelineItem[] = [
  { status: 'submitted', label: 'Application Submitted', description: 'Your application has been received and is in our queue.' },
  { status: 'under_review', label: 'Under Review', description: 'Our team is verifying your credentials with the NBA and Supreme Court.' },
  { status: 'verified', label: 'Verified & Approved', description: 'Your profile is now live in the lawyer directory.' },
];

const STATUS_ORDER: LawyerApplicationStatus[] = ['draft', 'submitted', 'under_review', 'verified'];

// ─── Dev Status Switcher ──────────────────────────────────────────────────────

const ALL_STATUSES: LawyerApplicationStatus[] = ['draft', 'submitted', 'under_review', 'verified', 'rejected', 'suspended'];

function DevStatusSwitcher() {
  const { colors } = useTheme();
  const { __devSetStatus } = useMarketplace();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = async (s: LawyerApplicationStatus) => {
    setLoading(true);
    await __devSetStatus(s);
    setLoading(false);
  };

  return (
    <View style={[dvSt.box, { backgroundColor: '#FEF9C3', borderColor: '#FDE68A' }]}>
      <TouchableOpacity style={dvSt.toggle} onPress={() => setOpen(!open)}>
        <Text style={dvSt.label}>🛠 DEV: Switch mock status</Text>
        {open ? <ChevronUp size={16} color="#92400E" /> : <ChevronDown size={16} color="#92400E" />}
      </TouchableOpacity>
      {open && (
        <View style={dvSt.btns}>
          {ALL_STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[dvSt.btn, { backgroundColor: '#FDE68A' }]}
              onPress={() => set(s)}
              disabled={loading}
              accessibilityLabel={`Set status to ${s}`}
            >
              <Text style={dvSt.btnText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const dvSt = StyleSheet.create({
  box: { borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 13, fontWeight: '800', color: '#92400E' },
  btns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: Spacing.sm },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.pill },
  btnText: { fontSize: 12, fontWeight: '700', color: '#78350F' },
});

// ─── Status Renderers ─────────────────────────────────────────────────────────

function SubmittedOrReviewScreen({ status }: { status: 'submitted' | 'under_review' }) {
  const { colors } = useTheme();
  const router = useRouter();
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <>
      {/* Hero */}
      <View style={[hSt.hero, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={[hSt.iconCircle, { backgroundColor: '#FEF3C7' }]}>
          <Clock size={36} color="#D97706" />
        </View>
        <Text style={[hSt.heroTitle, { color: colors.text }]}>
          {status === 'submitted' ? 'Application Received!' : 'Under Verification'}
        </Text>
        <Text style={[hSt.heroSub, { color: colors.textMuted }]}>
          {status === 'submitted'
            ? 'We\'ve received your application. Our team will begin reviewing it within 2-3 business days.'
            : 'Our compliance team is actively verifying your credentials. This typically takes 3-7 business days.'}
        </Text>
      </View>

      <TouchableOpacity
        style={[vSt.dashBtn, { backgroundColor: colors.primary, marginTop: Spacing.md, marginBottom: Spacing.md }]}
        onPress={() => router.push('/marketplace/dashboard' as any)}
        accessibilityLabel="Go to Lawyer Dashboard"
      >
        <Gavel size={18} color="#fff" />
        <Text style={vSt.dashBtnText}>Go to Lawyer Dashboard</Text>
      </TouchableOpacity>

      {/* Timeline */}
      <View style={[hSt.timeline, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Text style={[hSt.timelineTitle, { color: colors.text }]}>Application Progress</Text>
        {TIMELINE.map((item, i) => {
          const done = STATUS_ORDER.indexOf(item.status) <= currentIdx;
          const active = item.status === status;
          return (
            <View key={item.status} style={hSt.timelineItem}>
              <View style={hSt.timelineLine}>
                <View style={[hSt.dot, { backgroundColor: done ? colors.success : active ? '#D97706' : colors.border }]}>
                  {done && !active && <CheckCircle2 size={10} color="#fff" />}
                  {active && <Clock size={10} color="#fff" />}
                </View>
                {i < TIMELINE.length - 1 && <View style={[hSt.connector, { backgroundColor: done ? colors.success : colors.border }]} />}
              </View>
              <View style={hSt.timelineContent}>
                <Text style={[hSt.timelineLabel, { color: done ? colors.text : colors.textMuted, fontWeight: done ? '800' : '500' }]}>{item.label}</Text>
                <Text style={[hSt.timelineSub, { color: colors.textMuted }]}>{item.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

const hSt = StyleSheet.create({
  hero: { borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.md, borderWidth: 1, ...Shadows.md, gap: 12 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroSub: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  citizenNotice: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, marginBottom: Spacing.sm },
  citizenNoticeTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  citizenNoticeSub: { fontSize: 12, lineHeight: 18 },
  timeline: { borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, marginTop: Spacing.sm },
  timelineTitle: { fontSize: 15, fontWeight: '800', marginBottom: Spacing.md },
  timelineItem: { flexDirection: 'row', gap: 12, marginBottom: Spacing.md },
  timelineLine: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  connector: { width: 2, flex: 1, marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: Spacing.sm },
  timelineLabel: { fontSize: 14 },
  timelineSub: { fontSize: 12, lineHeight: 17, marginTop: 2 },
});

function VerifiedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[hSt.hero, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
      <View style={[hSt.iconCircle, { backgroundColor: colors.success + '20' }]}>
        <CheckCircle2 size={44} color={colors.success} />
      </View>
      <Text style={[hSt.heroTitle, { color: colors.text }]}>You're Verified! 🎉</Text>
      <Text style={[hSt.heroSub, { color: colors.textMuted }]}>
        Congratulations! Your profile is now live in the Rights Compass lawyer directory. Users can now find you and send consultation requests.
      </Text>
      <TouchableOpacity
        style={[vSt.dashBtn, { backgroundColor: colors.primary, marginTop: Spacing.xs }]}
        onPress={() => router.push('/marketplace/dashboard' as any)}
        accessibilityLabel="Go to my lawyer dashboard"
      >
        <ArrowRight size={18} color="#fff" />
        <Text style={vSt.dashBtnText}>Go to My Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[vSt.dashBtn, { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, marginTop: Spacing.sm }]}
        onPress={() => router.replace('/(tabs)' as any)}
        accessibilityLabel="Continue to Rights Compass main app"
      >
        <Compass size={18} color={colors.primary} />
        <Text style={[vSt.dashBtnText, { color: colors.primary }]}>Continue to Main App</Text>
      </TouchableOpacity>
    </View>
  );
}
const vSt = StyleSheet.create({
  dashBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 14, paddingHorizontal: Spacing.xl, gap: 8, ...Shadows.md, width: '100%' },
  dashBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

function RejectedScreen({ reason }: { reason?: string }) {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <>
      <View style={[hSt.hero, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
        <View style={[hSt.iconCircle, { backgroundColor: '#FEE2E2' }]}>
          <XCircle size={44} color="#DC2626" />
        </View>
        <Text style={[hSt.heroTitle, { color: '#7F1D1D' }]}>Application Not Approved</Text>
        <Text style={[hSt.heroSub, { color: '#991B1B' }]}>
          We were unable to verify your application at this time. Please review the feedback below and resubmit.
        </Text>
      </View>
      {reason && (
        <View style={[rjSt.reasonBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[rjSt.reasonTitle, { color: colors.text }]}>Reason for Rejection</Text>
          <Text style={[rjSt.reasonText, { color: colors.textMuted }]}>{reason}</Text>
        </View>
      )}
      <TouchableOpacity
        style={[rjSt.editBtn, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/lawyer-application' as any)}
        accessibilityLabel="Edit and resubmit application"
      >
        <RotateCcw size={18} color="#fff" />
        <Text style={rjSt.editBtnText}>Edit and Resubmit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[rjSt.editBtn, { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, marginTop: Spacing.sm }]}
        onPress={() => router.replace('/(tabs)' as any)}
        accessibilityLabel="Continue to Rights Compass main app"
      >
        <Compass size={18} color={colors.text} />
        <Text style={[rjSt.editBtnText, { color: colors.text }]}>Continue to Main App</Text>
      </TouchableOpacity>
    </>
  );
}
const rjSt = StyleSheet.create({
  reasonBox: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  reasonTitle: { fontSize: 14, fontWeight: '800', marginBottom: Spacing.sm },
  reasonText: { fontSize: 14, lineHeight: 22 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, gap: 8, ...Shadows.md },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

function SuspendedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[hSt.hero, { backgroundColor: '#FFF7ED', borderColor: '#F59E0B' }]}>
      <View style={[hSt.iconCircle, { backgroundColor: '#FEF3C7' }]}>
        <AlertTriangle size={44} color="#D97706" />
      </View>
      <Text style={[hSt.heroTitle, { color: '#78350F' }]}>Account Suspended</Text>
      <Text style={[hSt.heroSub, { color: '#92400E' }]}>
        Your lawyer profile has been temporarily suspended pending a compliance review. Please contact support at legal@rightscompass.ng for assistance.
      </Text>
      <TouchableOpacity
        style={[vSt.dashBtn, { backgroundColor: colors.primary, marginTop: Spacing.md }]}
        onPress={() => router.replace('/(tabs)' as any)}
        accessibilityLabel="Continue to Rights Compass main app"
      >
        <Compass size={18} color="#fff" />
        <Text style={vSt.dashBtnText}>Continue to Main App</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ApplicationStatusScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { application } = useMarketplace();
  const router = useRouter();
  const isWide = width > 768;

  const status = application?.status ?? 'draft';

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/marketplace/dashboard' as any))}
          accessibilityLabel="Go back"
        >
          <ArrowRight size={18} color={colors.text} style={{ transform: [{ scaleX: -1 }] }} />
        </TouchableOpacity>
        <Text style={[st.title, { color: colors.text }]}>Application Status</Text>
      </View>

      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
      >
        {/* DEV ONLY – status switcher */}
        {__DEV__ && <DevStatusSwitcher />}

        {(status === 'submitted' || status === 'under_review') && (
          <SubmittedOrReviewScreen status={status} />
        )}
        {status === 'verified' && <VerifiedScreen />}
        {status === 'rejected' && <RejectedScreen reason={application?.rejectionReason} />}
        {status === 'suspended' && <SuspendedScreen />}
        {(status === 'draft' || !status) && (
          <View style={[hSt.hero, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Search size={44} color={colors.textMuted} />
            <Text style={[hSt.heroTitle, { color: colors.text }]}>No Application Found</Text>
            <Text style={[hSt.heroSub, { color: colors.textMuted }]}>
              You haven't submitted a lawyer application yet.
            </Text>
            <TouchableOpacity
              style={[vSt.dashBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/lawyer-application' as any)}
              accessibilityLabel="Start lawyer application"
            >
              <Text style={vSt.dashBtnText}>Start Application</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[st.footerDis, { borderTopColor: colors.border }]}>
          <Text style={[st.footerDisText, { color: colors.textMuted }]}>
            Rights Compass is not a law firm and does not provide legal representation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  wideScroll: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  footerDis: { paddingTop: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  footerDisText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
