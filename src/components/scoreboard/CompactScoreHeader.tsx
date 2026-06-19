import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

interface CompactScoreHeaderProps {
  onBack?: () => void;
  onOpenSettings: () => void;
  subtitle: string;
  title: string;
}

export function CompactScoreHeader({
  onBack,
  onOpenSettings,
  subtitle,
  title,
}: CompactScoreHeaderProps) {
  return (
    <View style={styles.root}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Voltar"
          onPress={onBack}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Text style={styles.iconGlyph}>{'\u2039'}</Text>
        </Pressable>
      ) : (
        <View style={styles.iconButtonSpacer} />
      )}

      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Configurar mesa"
        onPress={onOpenSettings}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Text style={styles.iconGlyph}>{'\u2699'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  copyBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(8, 30, 24, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSpacer: {
    width: 34,
    height: 34,
  },
  iconGlyph: {
    color: colors.cream,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.display,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 38,
  },
  subtitle: {
    color: 'rgba(247, 240, 225, 0.60)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: fonts.body,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
});
