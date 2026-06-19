import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

interface ActionButtonProps {
  danger?: boolean;
  disabled?: boolean;
  onPress: () => void;
  title: string;
}

interface ScoreActionPanelProps {
  canUndo: boolean;
  isCompact: boolean;
  onResetCurrentSet: () => void;
  onResetMatch: () => void;
  onUndo: () => void;
  phase: 'idle' | 'inProgress' | 'setOver' | 'matchOver';
}

function ActionButton({
  danger = false,
  disabled = false,
  onPress,
  title,
}: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        danger ? styles.buttonDanger : styles.buttonDefault,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={[styles.buttonTitle, danger && styles.buttonTitleDanger]}>{title}</Text>
    </Pressable>
  );
}

export function ScoreActionPanel({
  canUndo,
  isCompact,
  onResetCurrentSet,
  onResetMatch,
  onUndo,
  phase,
}: ScoreActionPanelProps) {
  return (
    <View style={[styles.root, isCompact && styles.rootCompact]}>
      <ActionButton
        disabled={!canUndo}
        onPress={onUndo}
        title="Desfazer"
      />
      <ActionButton
        disabled={phase === 'matchOver'}
        onPress={onResetCurrentSet}
        title="Nova queda"
      />
      <ActionButton
        danger
        disabled={phase === 'idle'}
        onPress={onResetMatch}
        title={phase === 'matchOver' ? 'Jogar de novo' : 'Reiniciar'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 30,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: 'rgba(169, 53, 48, 0.12)',
    borderColor: 'rgba(169, 53, 48, 0.24)',
  },
  buttonDefault: {
    backgroundColor: 'rgba(247, 240, 225, 0.10)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  buttonDisabled: {
    opacity: 0.42,
  },
  buttonPressed: {
    transform: [{ scale: 0.992 }],
  },
  buttonTitle: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  buttonTitleDanger: {
    color: colors.white,
  },
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  rootCompact: {
    gap: 4,
  },
});
