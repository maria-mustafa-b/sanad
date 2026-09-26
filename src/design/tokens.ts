/** Design tokens — single source of truth for SANAD gov-tech UI */
export const tokens = {
  color: {
    brand: '#0E4A45',
    brandDark: '#0B3D3A',
    brandMid: '#146158',
    brandLight: '#1A7A6E',
    brandMuted: '#E6F2F0',
    background: '#F7F9F9',
    card: '#FFFFFF',
    border: '#E5EBEA',
    ink: '#0F1F1E',
    inkSecondary: '#4A5C5A',
    inkMuted: '#6B7C7A',
    success: '#1B7A4E',
    warning: '#C47A12',
    danger: '#C0352B',
    info: '#2B6CB0',
    adminBg: '#0A1211',
    adminPanel: '#111C1B',
  },
  radius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    full: '9999px',
  },
  shadow: {
    card: '0 1px 3px rgba(11, 61, 58, 0.06), 0 1px 2px rgba(11, 61, 58, 0.04)',
    elev: '0 8px 24px rgba(11, 61, 58, 0.1)',
  },
  space: {
    page: '1.5rem',
    section: '2.5rem',
  },
} as const;

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
