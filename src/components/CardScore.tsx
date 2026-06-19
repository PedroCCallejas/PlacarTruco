import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { CardPointTracker } from '@/components/CardPointTracker';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import type { BestOf, ScoreStyle, TrucoVariant } from '@/types/match';

interface CardScoreProps {
  accentColor: string;
  bestOf: BestOf;
  isActive: boolean;
  label: string;
  onPress: () => void;
  score: number;
  scoreStyle: ScoreStyle;
  sets: number;
  targetScore: number;
  teamName: string;
  variant: TrucoVariant;
}

export function CardScore({
  accentColor,
  bestOf,
  isActive,
  label,
  onPress,
  score,
  scoreStyle,
  sets,
  targetScore,
  teamName,
  variant,
}: CardScoreProps) {
  const { height, width } = useWindowDimensions();
  const compact = width < 420 || height < 760;
  const scoreLabel = `${score}`.padStart(2, '0');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.shell,
        compact && styles.shellCompact,
        isActive && [styles.shellActive, { borderColor: accentColor }],
        pressed && styles.pressed,
      ]}>
      <View style={[styles.sideGlow, { backgroundColor: accentColor }]} />

      <View style={styles.headerRow}>
        <View style={styles.identityBlock}>
          <View style={[styles.seatChip, { borderColor: accentColor }]}>
            <Text style={[styles.seatChipText, { color: accentColor }]}>{label}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.teamName, compact && styles.teamNameCompact]}>
            {teamName}
          </Text>
        </View>

        <View style={styles.setTrack}>
          {Array.from({ length: bestOf }).map((_, index) => {
            const filled = index < sets;

            return (
              <View
                key={`${label}-set-${index}`}
                style={[
                  styles.setPip,
                  filled && [styles.setPipFilled, { backgroundColor: accentColor }],
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.markerZone}>
        <CardPointTracker
          accentColor={accentColor}
          score={score}
          scoreStyle={scoreStyle}
          targetScore={targetScore}
          variant={variant}
        />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.scoreLabel}>Pontos</Text>
        <Text
          style={[
            styles.scoreValue,
            { color: isActive ? accentColor : colors.cream },
            compact && styles.scoreValueCompact,
          ]}>
          {scoreLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    alignItems: 'center',
    gap: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  identityBlock: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  markerZone: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.992 }],
  },
  scoreLabel: {
    color: 'rgba(247, 240, 225, 0.52)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  scoreValue: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  scoreValueCompact: {
    fontSize: 24,
    lineHeight: 24,
  },
  seatChip: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(8, 30, 24, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  seatChipText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  setPip: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  setPipFilled: {
    borderColor: 'transparent',
  },
  setTrack: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(7, 22, 18, 0.58)',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    ...shadows.card,
  },
  shellActive: {
    backgroundColor: 'rgba(10, 29, 24, 0.74)',
    shadowOpacity: 0.34,
  },
  shellCompact: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  sideGlow: {
    position: 'absolute',
    top: -40,
    left: '50%',
    width: 160,
    height: 160,
    marginLeft: -80,
    borderRadius: radii.pill,
    opacity: 0.08,
  },
  teamName: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  teamNameCompact: {
    fontSize: 16,
  },
});
