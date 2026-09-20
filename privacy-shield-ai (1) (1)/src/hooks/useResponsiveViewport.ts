import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ViewportState {
  device: DeviceType;
  width: number;
  height: number;
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  safeAreaBottom: number;
}

/**
 * Breakpoints aligned with modern responsive standards:
 * - Mobile:  < 768px  (Bottom Bar navigation)
 * - Tablet:  768px - 1023px (Horizontal Tabs navigation)
 * - Desktop: >= 1024px (Permanent Sidebar navigation)
 */
export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
} as const;

export function useResponsiveViewport(): ViewportState {
  const getDevice = (width: number): DeviceType => {
    if (width < BREAKPOINTS.TABLET_MIN) return 'mobile';
    if (width <= BREAKPOINTS.TABLET_MAX) return 'tablet';
    return 'desktop';
  };

  const [state, setState] = useState<ViewportState>(() => {
    const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      device: getDevice(initialWidth),
      width: initialWidth,
      height: initialHeight,
      isKeyboardOpen: false,
      keyboardHeight: 0,
      safeAreaBottom: 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const device = getDevice(width);

        // Detect Virtual Keyboard using visualViewport API
        let isKeyboardOpen = false;
        let keyboardHeight = 0;

        if (window.visualViewport) {
          const vv = window.visualViewport;
          // If visual viewport height is significantly less than window.innerHeight (>150px difference),
          // a virtual keyboard is active (or browser UI expanded drastically).
          const heightDiff = window.innerHeight - vv.height;
          if (heightDiff > 140 && device === 'mobile') {
            isKeyboardOpen = true;
            keyboardHeight = heightDiff;
          }
        }

        setState({
          device,
          width,
          height,
          isKeyboardOpen,
          keyboardHeight,
          safeAreaBottom: 0,
        });

        // Set dynamic CSS custom properties for 100% contained viewport calculations
        document.documentElement.style.setProperty('--app-viewport-height', `${height}px`);
      }, 16); // 60fps debounce
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
    }

    // Initial run
    handleResize();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return state;
}
