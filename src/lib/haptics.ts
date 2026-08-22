export const triggerHaptic = (
  type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error' | 'selection' = 'light'
) => {
  if (typeof window === 'undefined') return;

  const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: {
    impactOccurred: (style: string) => void;
    notificationOccurred: (type: string) => void;
    selectionChanged: () => void;
  } } } }).Telegram?.WebApp?.HapticFeedback;

  if (!tg) return;

  try {
    if (type === 'selection') {
      tg.selectionChanged();
    } else if (['success', 'warning', 'error'].includes(type)) {
      tg.notificationOccurred(type);
    } else {
      tg.impactOccurred(type);
    }
  } catch {
    // Fail silently on browsers without Telegram WebApp Haptic API
  }
};
