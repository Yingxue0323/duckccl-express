// 支持语言种类
export const LANGUAGES = {
  ENGLISH: 'EN',
  CHINESE_SIMPLIFIED: 'zh_CN',
  CHINESE_TRADITIONAL: 'zh_TW',
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


// 单词/练习分类(共13类，单词占7类，练习没有others类，12类)
export const CATEGORIES = {
  BUSINESS: 'BUSINESS', 
  COMMUNITY: 'COMMUNITY',
  EDUCATION: 'EDUCATION', //单词
  EMPLOYMENT: 'EMPLOYMENT',
  FINANCIAL: 'FINANCIAL',
  HOUSING: 'HOUSING',
  IMMIGRATION: 'IMMIGRATION', //单词
  INSURANCE: 'INSURANCE',
  LEGAL: 'LEGAL', //单词
  MEDICAL: 'MEDICAL', //单词
  SOCIAL_WELFARE: 'SOCIAL_WELFARE', //单词
  TOURISM: 'TOURISM', //单词
  OTHERS: 'OTHERS' //单词
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

// 题目来源：题库/真题回忆
export const EXERCISE_SOURCES = {
  QUESTION_BANK: 'QUESTION_BANK',
  EXAM_MEMORY: 'EXAM_MEMORY'
} as const;

export type ExerciseSource = typeof EXERCISE_SOURCES[keyof typeof EXERCISE_SOURCES];

// 单词学习状态：未学习/学习中/已掌握
export const LEARNED_STATUS = {
  UNLEARNED: 'UNLEARNED',
  LEARNING: 'LEARNING',
  LEARNED: 'LEARNED'
} as const;

export type LearnedStatus = typeof LEARNED_STATUS[keyof typeof LEARNED_STATUS];


// 静态内容类型
export const CONTENT_TYPE = {
  TERMS: 'TERMS',                // 用户协议
  PRIVACY: 'PRIVACY',            // 隐私政策
  VIP_GUIDE: 'VIP_GUIDE',        // 成为会员
  ADVANCED_INFO: 'ADVANCED_INFO', // 高级情报
  ABOUT: 'ABOUT'   
} as const;

export type ContentType = typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE];


// 登录类型: 小程序/APP
export const LOGIN_TYPE = {
  WECHAT: 'WECHAT',
  APP: 'APP'
} as const;

export type LoginType = typeof LOGIN_TYPE[keyof typeof LOGIN_TYPE];