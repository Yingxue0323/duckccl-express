// 支持语言种类
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


// 单词/练习分类
export const CATEGORIES = {
  BUSINESS: 'BUSINESS', 
  EDUCATION: 'EDUCATION',
  COMMUNITY: 'COMMUNITY',
  CONSUMER_AFFAIRS: 'CONSUMER_AFFAIRS',
  EMPLOYMENT: 'EMPLOYMENT',
  HOUSING: 'HOUSING',
  IMMIGRATION: 'IMMIGRATION',
  INSURANCE: 'INSURANCE',
  LEGAL: 'LEGAL',
  TRAVEL: 'TRAVEL',
  ENTERTAINMENT: 'ENTERTAINMENT',
  HEALTH: 'HEALTH',
  TECHNOLOGY: 'TECHNOLOGY'
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

// 题目来源：题库/真题回忆
export const EXERCISE_SOURCES = {
  QUESTION_BANK: 'QUESTION_BANK',
  EXAM_MEMORY: 'EXAM_MEMORY'
} as const;

export type ExerciseSource = typeof EXERCISE_SOURCES[keyof typeof EXERCISE_SOURCES];

// 单词学习状态：未学习/学习中/已掌握
export const WORD_STATUS = {
  UNLEARNED: 'UNLEARNED',
  LEARNING: 'LEARNING',
  MASTERED: 'MASTERED'
} as const;

export type WordStatus = typeof WORD_STATUS[keyof typeof WORD_STATUS];


// 静态内容类型
export const CONTENT_TYPE = {
  TERMS: 'TERMS',                // 用户协议
  PRIVACY: 'PRIVACY',            // 隐私政策
  VIP_GUIDE: 'VIP_GUIDE',        // 成为会员
  ADVANCED_INFO: 'ADVANCED_INFO', // 高级情报
  ABOUT: 'ABOUT'   
} as const;

export type ContentType = typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE];
