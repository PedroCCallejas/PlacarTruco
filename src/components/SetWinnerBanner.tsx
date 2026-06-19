import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { MatchResult } from '@/types/match';

interface SetWinnerBannerProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryLabel?: string;
  result: MatchResult | null;
  secondaryLabel?: string;
}

export function SetWinnerBanner({
  onPrimaryAction,
  onSecondaryAction,
  primaryLabel,
  result,
  secondaryLabel,
}: SetWinnerBannerProps) {
  if (!result) {
    return null;
  }

  const isMatch = result.type === 'match';

  return (
    <View style={[styles.banner, isMatch ? styles.bannerMatch : styles.bannerSet]}>
      <View style={styles.summaryRow}>
        <View style={styles.copyRow}>
          <Text style={[styles.kicker, isMatch ? styles.kickerMatch : styles.kickerSet]}>
            {isMatch ? 'Partida' : 'Queda'}
          </Text>
          <Text numberOfLines={1} style={styles.title}>
            {result.winningTeamName}
          </Text>
        </View>
        <View style={styles.metaTrail}>
          <Text style={styles.metaValue}>
            {result.score.teamA} x {result.score.teamB}
          </Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaValue}>
            {result.sets.teamA} x {result.sets.teamB}
          </Text>
        </View>
      </View>

      {primaryLabel || secondaryLabel ? (
        <View style={styles.actions}>
          {secondaryLabel && onSecondaryAction ? (
            <Pressable
              onPress={onSecondaryAction}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}

          {primaryLabel && onPrimaryAction ? (
            <Pressable
              onPress={onPrimaryAction}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>{primaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radii.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: spacing.xs,
  },
  bannerMatch: {
    backgroundColor: 'rgba(224, 177, 90, 0.12)',
    borderColor: 'rgba(224, 177, 90, 0.3)',
  },
  bannerSet: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  kickerMatch: {
    color: colors.gold,
  },
  kickerSet: {
    color: colors.cream,
  },
  metaDivider: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  metaTrail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  metaValue: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  primaryButton: {
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  secondaryButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  primaryText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  secondaryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
