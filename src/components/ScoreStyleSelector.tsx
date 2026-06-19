import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SCORE_STYLE_OPTIONS } from '@/constants/trucoRules';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { ScoreStyle } from '@/types/match';

interface ScoreStyleSelectorProps {
  compact?: boolean;
  onChange: (scoreStyle: ScoreStyle) => void;
  value: ScoreStyle;
}

export function ScoreStyleSelector({
  compact = false,
  onChange,
  value,
}: ScoreStyleSelectorProps) {
  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      {SCORE_STYLE_OPTIONS.map((option) => {
        const active = option.id === value;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              compact ? styles.compactOption : styles.option,
              active && (compact ? styles.compactOptionActive : styles.optionActive),
              pressed && styles.pressed,
            ]}>
            <Text style={[compact ? styles.compactLabel : styles.optionTitle, active && styles.optionTitleActive]}>
              {compact ? option.shortLabel : option.label}
            </Text>
            {!compact ? (
              <Text style={[styles.optionDescription, active && styles.optionDescriptionActive]}>
                {option.description}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  rootCompact: {
    gap: spacing.xs,
  },
  option: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 112,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(8, 30, 24, 0.46)',
    padding: spacing.md,
    gap: spacing.xs,
  },
  optionActive: {
    borderColor: 'rgba(224, 177, 90, 0.34)',
    backgroundColor: 'rgba(224, 177, 90, 0.12)',
  },
  compactOption: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  compactOptionActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  pressed: {
    transform: [{ scale: 0.992 }],
  },
  optionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  compactLabel: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: fonts.body,
  },
  optionTitleActive: {
    color: colors.ink,
  },
  optionDescription: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fonts.body,
  },
  optionDescriptionActive: {
    color: 'rgba(16, 36, 27, 0.8)',
  },
});
