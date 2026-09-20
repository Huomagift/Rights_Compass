/**
 * Shared progress indicator for the 4-step lawyer application flow.
 * Kept in a local component file so all 4 step screens can import it.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../constants/theme';

const STEPS = ['Personal', 'Credentials', 'Documents', 'Review'];

export function ApplicationProgress({ currentStep }: { currentStep: number }) {
  const { colors } = useTheme();
  return (
    <View style={st.wrapper}>
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={label}>
            <View style={st.step}>
              <View
                style={[
                  st.circle,
                  done && { backgroundColor: colors.success },
                  active && { backgroundColor: colors.primary },
                  !done && !active && { backgroundColor: colors.border },
                ]}
              >
                {done ? (
                  <Check size={12} color="#fff" />
                ) : (
                  <Text style={[st.num, { color: active ? '#fff' : colors.textMuted }]}>{i + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  st.label,
                  { color: active ? colors.primary : done ? colors.success : colors.textMuted },
                  (active || done) && { fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[st.line, { backgroundColor: i < currentStep ? colors.success : colors.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  step: { alignItems: 'center', gap: 4 },
  circle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 12, fontWeight: '800' },
  label: { fontSize: 10, letterSpacing: 0.2 },
  line: { flex: 1, height: 2, marginBottom: 14 },
});
