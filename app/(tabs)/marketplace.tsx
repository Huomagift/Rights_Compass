import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ShieldCheck, CheckCircle2, Star } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';

const MOCK_LAWYERS = [
  {
    id: 'l1',
    name: 'Barrister Chidi Okonkwo',
    nbaNumber: 'NBA/EN/2014/4892',
    specialty: 'Police Stops & Criminal Defense',
    rating: 4.9,
    reviewsCount: 38,
    proBono: true,
    location: 'Lagos Island, Lagos',
    verified: true,
  },
  {
    id: 'l2',
    name: 'Amina Yusuf & Co. Chambers',
    nbaNumber: 'NBA/ABJ/2011/1209',
    specialty: 'Tenancy & Landlord Disputes',
    rating: 4.8,
    reviewsCount: 52,
    proBono: false,
    location: 'Central Business District, Abuja',
    verified: true,
  },
  {
    id: 'l3',
    name: 'Adebowale & Partners',
    nbaNumber: 'NBA/IB/2016/9931',
    specialty: 'Employment Law & Wrongful Dismissal',
    rating: 4.7,
    reviewsCount: 29,
    proBono: true,
    location: 'Bodija, Ibadan',
    verified: true,
  },
];

export default function MarketplaceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Find Legal Aid</Text>
        <Text style={styles.pageSubtitle}>
          Connect with NBA-verified lawyers and pro bono legal aid organizations for case-specific representation.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerBox}>
          <ShieldCheck size={24} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text style={styles.bannerTitle}>NBA Verification Guaranteed</Text>
            <Text style={styles.bannerSub}>
              All listed legal practitioners are verified against the Nigerian Bar Association enrollment database.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Featured Practitioners</Text>

        {MOCK_LAWYERS.map((lawyer) => (
          <View key={lawyer.id} style={styles.lawyerCard}>
            <View style={styles.cardTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.lawyerName}>{lawyer.name}</Text>
                  {lawyer.verified && (
                    <CheckCircle2
                      size={16}
                      color={Colors.success}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text style={styles.nbaText}>
                  {lawyer.nbaNumber} • {lawyer.location}
                </Text>
              </View>

              <View style={styles.ratingBadge}>
                <Star size={12} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingText}>{lawyer.rating}</Text>
              </View>
            </View>

            <Text style={styles.specialtyTag}>⚖️ {lawyer.specialty}</Text>

            <View style={styles.cardFooter}>
              {lawyer.proBono ? (
                <View style={styles.proBonoBadge}>
                  <Text style={styles.proBonoText}>Pro Bono Available</Text>
                </View>
              ) : (
                <Text style={styles.feeText}>Fee-based representation</Text>
              )}

              <TouchableOpacity style={styles.contactBtn}>
                <Text style={styles.contactBtnText}>Request Intake</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  bannerSub: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.text,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  lawyerCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  nbaText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    height: 24,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 2,
  },
  specialtyTag: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  proBonoBadge: {
    backgroundColor: 'rgba(45, 122, 70, 0.12)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  proBonoText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  feeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  contactBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
});
