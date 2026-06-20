import { StyleSheet, Text, View } from 'react-native';

import { BeanMarkerBoard } from '@/components/BeanMarkerBoard';
import { CardMarkerBoard } from '@/components/CardMarkerBoard';
import { CrystalMarkerBoard } from '@/components/CrystalMarkerBoard';
import { fonts, spacing } from '@/constants/theme';
import type { ScoreStyle, TrucoVariant } from '@/types/match';

interface CardPointTrackerProps {
  accentColor: string;
  availableHeight: number;
  placementSeed: number;
  score: number;
  scoreStyle: ScoreStyle;
  targetScore: number;
  variant: TrucoVariant;
}

function clampScore(score: number, targetScore: number) {
  return Math.max(0, Math.min(score, targetScore));
}

function getCaption(
  score: number,
  scoreStyle: ScoreStyle,
  targetScore: number,
  variant: TrucoVariant
) {
  const safeScore = clampScore(score, targetScore);

  if (scoreStyle === 'cards') {
    if (variant === 'truco-espanhol' && safeScore > 9) {
      return `9 + ${Math.min(safeScore - 9, 9)}`;
    }

    return variant === 'truco-paulista'
      ? `${Math.min(safeScore, 12)} / 12`
      : `${Math.min(safeScore, 9)} / 9`;
  }

  if (targetScore === 18 && safeScore > 9) {
    return `9 + ${Math.min(safeScore - 9, 9)}`;
  }

  return `${safeScore} / ${targetScore}`;
}

export function CardPointTracker({
  accentColor,
  availableHeight,
  placementSeed,
  score,
  scoreStyle,
  targetScore,
  variant,
}: CardPointTrackerProps) {
  const caption = getCaption(score, scoreStyle, targetScore, variant);

  return (
    <View style={styles.root}>
      {scoreStyle === 'cards' ? (
        <CardMarkerBoard
          accentColor={accentColor}
          availableHeight={availableHeight}
          score={score}
          targetScore={targetScore}
          variant={variant}
        />
      ) : null}

      {scoreStyle === 'beans' ? (
        <BeanMarkerBoard
          accentColor={accentColor}
          placementSeed={placementSeed}
          score={score}
          targetScore={targetScore}
        />
      ) : null}

      {scoreStyle === 'crystals' ? (
        <CrystalMarkerBoard
          accentColor={accentColor}
          placementSeed={placementSeed}
          score={score}
          targetScore={targetScore}
        />
      ) : null}

      {scoreStyle !== 'cards' ? (
        <Text style={[styles.caption, { color: accentColor }]}>{caption}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  root: {
    flex: 1,
    gap: spacing.xs,
  },
});
