import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Shield,
  Home,
  Briefcase,
  ShoppingBag,
  Scale,
  Book,
  Check,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export interface DomainOption {
  id: string;
  label: string;
  description: string;
  Icon: any;
}

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: 'police',
    label: 'Police Stop & Arrest Rights',
    description: 'Checkpoint rules, search warrants, phone searches & bail rights.',
    Icon: Shield,
  },
  {
    id: 'tenancy',
    label: 'Tenant & Housing Rights',
    description: 'Rent increase limits, valid quit notice periods & landlord obligations.',
    Icon: Home,
  },
  {
    id: 'employment',
    label: 'Employment & Labor Law',
    description: 'Wrongful termination, statutory severance, notice pay & workplace safety.',
    Icon: Briefcase,
  },
  {
    id: 'consumer',
    label: 'Consumer Rights & Refunds',
    description: 'Digital subscriptions, defective items, unfair billing & FCCPA protections.',
    Icon: ShoppingBag,
  },
  {
    id: 'civil',
    label: 'Fundamental Civil Rights',
    description: 'Freedom of expression, peaceful assembly, privacy & fair hearing rights.',
    Icon: Scale,
  },
  {
    id: 'other',
    label: 'General Knowledge',
    description: 'Essential everyday rights and general constitutional protections.',
    Icon: Book,
  },
];

interface StepTopicsProps {
  selectedDomains: string[];
  onToggleDomain: (id: string) => void;
}

export const StepTopics: React.FC<StepTopicsProps> = ({
  selectedDomains,
  onToggleDomain,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.stepBox}>
      {/* AEGIS MINI BANNER */}
      <View
        style={[
          styles.aegisMiniBanner,
          { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
        ]}
      >
        <Image
          source={require('../../assets/images/mascot.png')}
          style={styles.aegisMiniAvatar}
          contentFit="cover"
        />
        <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
          &quot;Pick the areas you want to master first. You can always change them later!&quot;
        </Text>
      </View>

      <View style={styles.sectionHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headlineTitle, { color: colors.text }]}>
            Choose Priority Rights
          </Text>
          <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
            Select all legal topics relevant to your life and work.
          </Text>
        </View>
        <View
          style={[
            styles.selectedBadge,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.selectedBadgeText, { color: colors.primary }]}>
            {selectedDomains.length} selected
          </Text>
        </View>
      </View>

      <View style={styles.selectionCardsList}>
        {DOMAIN_OPTIONS.map((domain) => {
          const isSelected = selectedDomains.includes(domain.id);
          const IconComp = domain.Icon;

          return (
            <TouchableOpacity
              key={domain.id}
              style={[
                styles.selectionCard,
                {
                  backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => onToggleDomain(domain.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <View
                style={[
                  styles.domainIconSquare,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  },
                ]}
              >
                <IconComp size={22} color={isSelected ? '#FFFFFF' : colors.primary} />
              </View>

              <View style={styles.domainTextCol}>
                <Text
                  style={[
                    styles.domainTitleText,
                    {
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? '800' : '700',
                    },
                  ]}
                >
                  {domain.label}
                </Text>
                {domain.description ? (
                  <Text style={[styles.domainDescText, { color: colors.textMuted }]}>
                    {domain.description}
                  </Text>
                ) : null}
              </View>

              <View
                style={[
                  styles.checkIndicatorCircle,
                  {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                {isSelected && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepBox: {
    width: '100%',
  },
  aegisMiniBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  aegisMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: Spacing.sm,
  },
  aegisMiniText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    marginLeft: 8,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  selectionCardsList: {
    gap: Spacing.sm,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  domainIconSquare: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  domainTextCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  domainTitleText: {
    fontSize: 14,
    marginBottom: 2,
  },
  domainDescText: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkIndicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
