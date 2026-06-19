import type { ImageSourcePropType } from 'react-native';

export type TrucoAssetSource = ImageSourcePropType | null;

export const trucoAssets = {
  table: {
    feltGreen: require('../../assets/truco/table/felt-green.png') as TrucoAssetSource,
    woodFrame: require('../../assets/truco/table/wood-frame.png') as TrucoAssetSource,
  },
  cards: {
    card10Front: require('../../assets/truco/cards/card-10-front.png') as TrucoAssetSource,
    card9Front: require('../../assets/truco/cards/card-9-front.png') as TrucoAssetSource,
    cardBackRed: require('../../assets/truco/cards/card-back-red.png') as TrucoAssetSource,
    cardBackBlue: require('../../assets/truco/cards/card-back-blue.png') as TrucoAssetSource,
  },
  beans: {
    bean01: require('../../assets/truco/beans/bean-01.png') as TrucoAssetSource,
    bean02: require('../../assets/truco/beans/bean-02.png') as TrucoAssetSource,
  },
  crystals: {
    crystalRed: require('../../assets/truco/crystals/crystal-red.png') as TrucoAssetSource,
    crystalPurple: require('../../assets/truco/crystals/crystal-purple.png') as TrucoAssetSource,
    crystalGold: require('../../assets/truco/crystals/crystal-gold.png') as TrucoAssetSource,
  },
  shadows: {
    cardShadow: require('../../assets/truco/shadows/card-shadow.png') as TrucoAssetSource,
    objectShadow: require('../../assets/truco/shadows/object-shadow.png') as TrucoAssetSource,
  },
} as const;
