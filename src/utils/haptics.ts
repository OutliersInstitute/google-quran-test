// Haptic feedback utility using Web Vibration API

let hapticsEnabled = true;

// Load persisted preference if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('hifz_haptics_enabled');
    if (saved !== null) {
      hapticsEnabled = saved === 'true';
    }
  } catch {
    // Ignore storage errors
  }
}

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('hifz_haptics_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }
}

export function getHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function isHapticSupported(): boolean {
  return typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function';
}

export type HapticType = 
  | 'light'        // Subtle tap (e.g. blank selection, carousel navigation)
  | 'medium'       // General button click
  | 'pageFlip'     // Turning pages
  | 'success'      // Correct answer selected
  | 'error'        // Incorrect answer selected
  | 'celebrate';   // Page or range completed

export function triggerHaptic(type: HapticType): void {
  if (!hapticsEnabled || !isHapticSupported()) return;

  try {
    switch (type) {
      case 'light':
        // Crisp, subtle 10ms tap
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(22);
        break;
      case 'pageFlip':
        // Smooth page turning vibration
        navigator.vibrate([15, 25, 15]);
        break;
      case 'success':
        // Crisp double tap of accomplishment
        navigator.vibrate([15, 35, 30]);
        break;
      case 'error':
        // Warning double pulse
        navigator.vibrate([35, 45, 35]);
        break;
      case 'celebrate':
        // Rewarding completion rhythm
        navigator.vibrate([20, 30, 30, 40, 60]);
        break;
    }
  } catch {
    // Gracefully handle iframe / security permission restrictions
  }
}
