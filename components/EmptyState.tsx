import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SearchX, Inbox, Compass, ArrowRight } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export interface EmptyStateProps {
  icon?: 'search' | 'inbox' | 'compass' | React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'compass',
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) => {
  const { colors } = useTheme();

  const renderIcon = () => {
    if (typeof icon !== 'string') return icon;

    switch (icon) {
      case 'search':
        return <SearchX size={compact ? 32 : 44} color={colors.primary} />;
      case 'inbox':
        return <Inbox size={compact ? 32 : 44} color={colors.primary} />;
      case 'compass':
      default:
        return <Compass size={compact ? 32 : 44} color={colors.primary} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
        compact && styles.compactContainer,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.accentLight,
            borderColor: colors.border,
          },
          compact && styles.compactIconCircle,
        ]}
      >
        {renderIcon()}
      </View>

      <Text style={[styles.title, { color: colors.text }, compact && styles.compactTitle]}>
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          { color: colors.textMuted },
          compact && styles.compactDescription,
        ]}
      >
        {description}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={onAction}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginVertical: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  compactContainer: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  compactIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  compactTitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: Spacing.md,
  },
  compactDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.xs,
    ...Shadows.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: Spacing.xs,
  },
});
