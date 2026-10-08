import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  User,
  Phone,
  Shield,
  Check,
  Briefcase,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface StepPhoneProps {
  name: string;
  onChangeName: (val: string) => void;
  phone: string;
  onChangePhone: (val: string) => void;
  isLawyerPath: boolean;
  onToggleLawyerPath: (val: boolean) => void;
  marketplaceEnabled: boolean;
}

export const StepPhone: React.FC<StepPhoneProps> = ({
  name,
  onChangeName,
  phone,
  onChangePhone,
  isLawyerPath,
  onToggleLawyerPath,
  marketplaceEnabled,
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
          &quot;Let&apos;s personalize your compass so I can tailor your legal guides.&quot;
        </Text>
      </View>

      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        What should we call you?
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        Provide your name and WhatsApp number to secure your offline legal compass.
      </Text>

      {/* NAME INPUT GROUP */}
      <View style={styles.inputGroupContainer}>
        <Text style={[styles.inputFieldLabel, { color: colors.text }]}>
          Full Name <Text style={{ color: colors.primary }}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
        >
          <User size={18} color={colors.primary} style={{ marginRight: 10 }} />
          <TextInput
            style={[styles.nativeTextInput, { color: colors.text }]}
            placeholder="e.g. Alex Adebayo"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={onChangeName}
            autoCapitalize="words"
            autoFocus
          />
          {name.trim().length > 0 && <Check size={16} color={colors.success} />}
        </View>
      </View>

      {/* PHONE INPUT GROUP WITH +234 BADGE */}
      <View style={styles.inputGroupContainer}>
        <Text style={[styles.inputFieldLabel, { color: colors.text }]}>
          WhatsApp Phone Number <Text style={{ color: colors.primary }}>*</Text>
        </Text>
        <Text style={[styles.fieldHelperText, { color: colors.textMuted }]}>
          We will send a 6-digit WhatsApp verification code to confirm this device.
        </Text>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.countryCodeBadge,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.countryCodeText, { color: colors.text }]}>🇳🇬 +234</Text>
          </View>
          <Phone size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.nativeTextInput, { color: colors.text }]}
            placeholder="0801 234 5678"
            placeholderTextColor={colors.textMuted}
            value={phone}
            onChangeText={onChangePhone}
            keyboardType="phone-pad"
          />
          {phone.trim().length >= 10 && <Check size={16} color={colors.success} />}
        </View>
      </View>

      {/* PRIVACY PROMISE */}
      <View
        style={[
          styles.privacyPromiseCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <Shield size={16} color={colors.success} style={{ marginRight: 8 }} />
        <Text style={[styles.privacyPromiseText, { color: colors.textMuted }]}>
          We respect your privacy. Your contact info is strictly protected on your device. Never shared or sold.
        </Text>
      </View>

      {/* LAWYER PATH OPTION – ONLY WHEN MARKETPLACE FLAG IS ON */}
      {marketplaceEnabled && (
        <TouchableOpacity
          style={[
            styles.lawyerPathCard,
            {
              backgroundColor: isLawyerPath ? colors.accentLight : colors.cardWhite,
              borderColor: isLawyerPath ? colors.primary : colors.border,
              borderWidth: isLawyerPath ? 2 : 1,
            },
          ]}
          onPress={() => onToggleLawyerPath(!isLawyerPath)}
          activeOpacity={0.85}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isLawyerPath }}
          accessibilityLabel="I am a Lawyer / Legal Practitioner"
        >
          <View
            style={[
              styles.lawyerPathIconCircle,
              { backgroundColor: isLawyerPath ? colors.primary : colors.cardBackground },
            ]}
          >
            <Briefcase size={20} color={isLawyerPath ? '#FFFFFF' : colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.lawyerPathTitle,
                { color: isLawyerPath ? colors.primary : colors.text },
              ]}
            >
              I am a Lawyer / Legal Practitioner
            </Text>
            <Text style={[styles.lawyerPathSub, { color: colors.textMuted }]}>
              Apply to join our NBA-verified lawyer directory after completing onboarding.
            </Text>
          </View>
          <View
            style={[
              styles.lawyerPathCheck,
              {
                backgroundColor: isLawyerPath ? colors.primary : 'transparent',
                borderColor: isLawyerPath ? colors.primary : colors.border,
              },
            ]}
          >
            {isLawyerPath && <Check size={14} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      )}
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
  headlineTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  inputGroupContainer: {
    marginBottom: Spacing.md,
  },
  inputFieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  fieldHelperText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
    ...Shadows.sm,
  },
  countryCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nativeTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },
  privacyPromiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  privacyPromiseText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  lawyerPathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  lawyerPathIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lawyerPathTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  lawyerPathSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  lawyerPathCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
