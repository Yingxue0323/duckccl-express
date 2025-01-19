export const LANGUAGES = {
  ENGLISH: 'EN',
  CHINESE: 'CH',
  JAPANESE: 'JP',
  KOREAN: 'KR',
  FRENCH: 'FR',
  SPANISH: 'ES',
  ARABIC: 'AR',
  GERMAN: 'DE',
  ITALIAN: 'IT',
  PORTUGUESE: 'PT',
  RUSSIAN: 'RU',
  TURKISH: 'TR',
  VIETNAMESE: 'VN',
  INDONESIAN: 'ID',
  MALAYSIAN: 'MS',
  HINDI: 'HI'
} as const;
export type LanguageCode = typeof LANGUAGES[keyof typeof LANGUAGES];
