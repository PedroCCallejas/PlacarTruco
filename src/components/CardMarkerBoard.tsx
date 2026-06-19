import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { CardRevealMarker } from '@/components/CardRevealMarker';
import {
  paulistaCardStates,
  spanishCardStates,
} from '@/components/scoreboard/CardCoverStates';
import { trucoAssets } from '@/constants/trucoAssets';
import { colors, radii } from '@/constants/theme';
import type { TrucoVariant } from '@/types/match';

interface CardMarkerBoardProps {
  accentColor: string;
  score: number;
  targetScore: number;
  variant: TrucoVariant;
}

function clampScore(variant: TrucoVariant, score: number, targetScore: number) {
  const variantLimit = variant === 'truco-paulista' ? 12 : 18;

  return Math.max(0, Math.min(score, Math.min(targetScore, variantLimit)));
}

export function CardMarkerBoard({
  accentColor,
  score,
  targetScore,
  variant,
}: CardMarkerBoardProps) {
  const { height, width } = useWindowDimensions();
  const compact = width < 420 || height < 760;
  const safeScore = clampScore(variant, score, targetScore);
  const frontAsset =
    variant === 'truco-paulista'
      ? trucoAssets.cards.card10Front
      : trucoAssets.cards.card9Front;
  const backAsset =
    accentColor === colors.gold
      ? trucoAssets.cards.cardBackBlue
      : trucoAssets.cards.cardBackRed;
  const shadowAsset = trucoAssets.shadows.cardShadow;
  const cardWidth = compact ? 112 : width < 900 ? 124 : 140;
  const cardHeight = Math.round(cardWidth * 1.414);
  const stageWidth = cardWidth + (compact ? 84 : 96);
  const stageHeight = cardHeight + (compact ? 30 : 36);
  const baseCardLeft = compact ? 8 : 10;
  const baseCardTop = compact ? 26 : 28;
  const topCardAnchorLeft = compact ? 14 : 18;
  const topCardAnchorTop = compact ? 4 : 6;
  const shadowWidth = cardWidth + 10;
  const shadowHeight = cardHeight + 12;
  const activeState =
    variant === 'truco-paulista'
      ? paulistaCardStates[safeScore]
      : spanishCardStates[safeScore];
  const topCardAsset = activeState.face === 'front' ? frontAsset : backAsset;
  const topCardMode = activeState.face === 'front' ? 'turned' : 'covered';
  const topCardTransform = {
    transform: [
      { translateX: activeState.x },
      { translateY: activeState.y },
      { rotate: `${activeState.rotate}deg` },
    ],
  } as const;

  return (
    <View style={styles.stage}>
      <View style={[styles.canvas, { width: stageWidth, height: stageHeight }]}>
        {shadowAsset ? (
          <Image
            contentFit="contain"
            source={shadowAsset}
            style={[
              styles.shadowAsset,
              styles.baseTilt,
              {
                width: shadowWidth,
                height: shadowHeight,
                left: baseCardLeft - 3,
                top: baseCardTop - 4,
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.cardBase,
            styles.baseTilt,
            {
              width: cardWidth,
              height: cardHeight,
              left: baseCardLeft,
              top: baseCardTop,
            },
          ]}>
          {frontAsset ? (
            <Image contentFit="fill" source={frontAsset} style={styles.cardImage} />
          ) : null}
          <View style={styles.cardFrame} />
        </View>

        {shadowAsset ? (
          <Image
            contentFit="contain"
            source={shadowAsset}
            style={[
              styles.shadowAsset,
              {
                width: shadowWidth,
                height: shadowHeight,
                left: topCardAnchorLeft - 3,
                top: topCardAnchorTop - 3,
              },
              topCardTransform,
            ]}
          />
        ) : null}

        <CardRevealMarker
          mode={topCardMode}
          style={[
            {
              width: cardWidth,
              height: cardHeight,
              left: topCardAnchorLeft,
              top: topCardAnchorTop,
            },
            topCardTransform,
          ]}
          surfaceAsset={topCardAsset}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseTilt: {
    transform: [{ rotate: '-6deg' }],
  },
  canvas: {
    position: 'relative',
  },
  cardBase: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(84, 53, 28, 0.14)',
    backgroundColor: colors.card,
  },
  cardFrame: {
    ...StyleSheet.absoluteFillObject,
    top: 9,
    left: 9,
    right: 9,
    bottom: 9,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 36, 27, 0.10)',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  shadowAsset: {
    position: 'absolute',
    opacity: 0.22,
  },
  stage: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
