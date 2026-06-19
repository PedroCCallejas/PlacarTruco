import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

interface ConfirmActionModalProps {
  body: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  visible: boolean;
}

export function ConfirmActionModal({
  body,
  cancelLabel = 'Cancelar',
  confirmLabel,
  onCancel,
  onConfirm,
  title,
  visible,
}: ConfirmActionModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.topLine} />
          <Text style={styles.kicker}>Confirmacao</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}>
              <Text style={styles.dangerText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  body: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  dangerButton: {
    flexGrow: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.red,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dangerText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: fonts.body,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    overflow: 'hidden',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(169, 53, 48, 0.32)',
    backgroundColor: colors.feltDeep,
    padding: spacing.xl,
    gap: spacing.md,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  secondaryButton: {
    flexGrow: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.body,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    fontFamily: fonts.display,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: colors.red,
    opacity: 0.24,
  },
});
