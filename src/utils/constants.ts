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

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

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
  EXAM_RECALL: 'EXAM_RECALL'
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

// HTTP 状态码对应的业务错误码
export enum ResponseCode {
  // 成功 (2xxxx)
  SUCCESS = 20000,

  // 认证相关 (4xxxx)
  TOKEN_INVALID = 40001,
  TOKEN_REFRESH_FAILED = 40002,
  LOGOUT_FAILED = 40003,

  // 用户相关 (41xxx)
  USER_NOT_FOUND = 41001,
  GET_ALL_USERS_FAILED = 41002,
  GET_USER_PROFILE_FAILED = 41003,
  GET_USER_BY_ID_FAILED = 41004,
  GET_USER_BY_OPENID_FAILED = 41005,
  UPDATE_USER_FAILED = 41006,
  DELETE_USER_FAILED = 41007,
  GENERATE_REDEEM_CODE_FAILED = 41008,
  VERIFY_REDEEM_CODE_FAILED = 41009,
  CREATE_FEEDBACK_FAILED = 41010,
  // 单词相关（42xxx）
  GET_WORD_MENUS_FAILED = 42000,
  WORD_NOT_FOUND = 42001,
  CREATE_WORD_FAILED = 42002,
  GET_ALL_WORDS_FAILED = 42003,
  GET_WORD_BY_CATEGORIES_FAILED = 42004,
  GET_WORD_BY_ID_FAILED = 42005,
  UPDATE_WORD_FAILED = 42006,
  DELETE_WORD_FAILED = 42007,

  // 单词学习状态相关 (42008-42010)
  GET_WORD_LEARNING_STATUS_FAILED = 42008,
  UPDATE_WORD_LEARNING_STATUS_FAILED = 42009,

  // 单词收藏状态相关 (42011-42013)
  FAVORITE_WORD_FAILED = 42011,
  UNFAVORITE_WORD_FAILED = 42012,
  GET_WORD_FAV_STATUS_FAILED = 42013,

  // 练习相关 (43xxx)
  GET_MENUS_FAILED = 43000,
  EXERCISE_NOT_FOUND = 43001,
  CREATE_EXERCISE_FAILED = 43002,
  GET_ALL_EXERCISES_FAILED = 43003,
  GET_EXERCISE_BY_CATEGORIES_FAILED = 43004,
  GET_EXERCISE_BY_ID_FAILED = 43005,
  UPDATE_EXERCISE_FAILED = 43006,
  DELETE_EXERCISE_FAILED = 43007,
  GET_RANDOM_EXERCISES_FAILED = 43008,

  // 练习学习状态相关 (43009-43012)
  LEARN_EXERCISE_FAILED = 43009,
  UNLEARN_EXERCISE_FAILED = 43010,
  GET_EXE_LEARNING_STATUS_FAILED = 43011,

  // 练习收藏状态相关 (43013-43018)
  FAVORITE_EXERCISE_FAILED = 43013,
  UNFAVORITE_EXERCISE_FAILED = 43014,
  GET_EXE_FAV_STATUS_FAILED = 43015,

  // 音频相关 (44xxx)
  CREATE_AUDIO_FAILED = 44001,
  GET_AUDIO_FAILED = 44002,
  GET_ALL_AUDIOS_FAILED = 44003,
  UPDATE_AUDIO_FAILED = 44005,
  DELETE_AUDIO_FAILED = 44006,
  FAVORITE_AUDIO_FAILED = 44007,
  UNFAVORITE_AUDIO_FAILED = 44008,
  GET_FAVORITE_AUDIO_STATUS_FAILED = 44009,
  
  // 通用错误 (45xxx)
  INVALID_PARAM = 45001,

  // 服务器错误 (5xxxx)
  INTERNAL_SERVER_ERROR = 50001,
  DATABASE_ERROR = 50002,

  // 外部接口错误 (6xxxx)
  WX_LOGIN_FAILED = 60001,
  S3_UPLOAD_FAILED = 60002,
  S3_DELETE_FAILED = 60003,
  S3_GET_FAILED = 60004,
  S3_POST_FAILED = 60006,
  S3_PATCH_FAILED = 60007,
}

// 错误信息映射
export const ErrorMessages: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '操作成功',

  // 认证相关
  [ResponseCode.TOKEN_INVALID]: '无效的认证令牌',
  [ResponseCode.TOKEN_REFRESH_FAILED]: '刷新token失败',
  [ResponseCode.LOGOUT_FAILED]: '登出失败',

  // 用户相关
  [ResponseCode.USER_NOT_FOUND]: '用户不存在',
  [ResponseCode.GET_ALL_USERS_FAILED]: '获取所有用户失败',
  [ResponseCode.GET_USER_PROFILE_FAILED]: '获取用户信息失败',
  [ResponseCode.GET_USER_BY_ID_FAILED]: '获取用户信息失败',
  [ResponseCode.GET_USER_BY_OPENID_FAILED]: '通过openid获取用户失败',
  [ResponseCode.UPDATE_USER_FAILED]: '更新用户信息失败',
  [ResponseCode.DELETE_USER_FAILED]: '删除用户失败',
  [ResponseCode.GENERATE_REDEEM_CODE_FAILED]: '生成邀请码失败',
  [ResponseCode.VERIFY_REDEEM_CODE_FAILED]: '验证并使用邀请码失败',
  [ResponseCode.CREATE_FEEDBACK_FAILED]: '提交反馈失败',

  // 单词相关
  [ResponseCode.GET_WORD_MENUS_FAILED]: '获取单词菜单失败',
  [ResponseCode.WORD_NOT_FOUND]: '单词不存在',
  [ResponseCode.CREATE_WORD_FAILED]: '创建单词失败',
  [ResponseCode.GET_ALL_WORDS_FAILED]: '获取所有单词失败',
  [ResponseCode.GET_WORD_BY_CATEGORIES_FAILED]: '获取分类单词失败',
  [ResponseCode.GET_WORD_BY_ID_FAILED]: '获取单词详情失败',
  [ResponseCode.UPDATE_WORD_FAILED]: '更新单词失败',
  [ResponseCode.DELETE_WORD_FAILED]: '删除单词失败',
  [ResponseCode.GET_WORD_LEARNING_STATUS_FAILED]: '获取学习状态失败',
  [ResponseCode.UPDATE_WORD_LEARNING_STATUS_FAILED]: '标为已学失败',
  [ResponseCode.FAVORITE_WORD_FAILED]: '收藏单词失败',
  [ResponseCode.UNFAVORITE_WORD_FAILED]: '取消收藏单词失败',
  [ResponseCode.GET_WORD_FAV_STATUS_FAILED]: '获取单词收藏状态失败',

  // 练习相关
  [ResponseCode.GET_MENUS_FAILED]: '获取菜单失败',
  [ResponseCode.EXERCISE_NOT_FOUND]: '练习不存在',
  [ResponseCode.CREATE_EXERCISE_FAILED]: '创建练习失败',
  [ResponseCode.GET_ALL_EXERCISES_FAILED]: '获取所有练习失败',
  [ResponseCode.GET_EXERCISE_BY_CATEGORIES_FAILED]: '获取分类练习失败',
  [ResponseCode.GET_EXERCISE_BY_ID_FAILED]: '获取练习详情失败',
  [ResponseCode.UPDATE_EXERCISE_FAILED]: '更新练习失败',
  [ResponseCode.DELETE_EXERCISE_FAILED]: '删除练习失败',
  [ResponseCode.GET_RANDOM_EXERCISES_FAILED]: '获取随机练习失败',

  // 练习学习状态相关 (43007-43012)
  [ResponseCode.LEARN_EXERCISE_FAILED]: '标为已学失败',
  [ResponseCode.UNLEARN_EXERCISE_FAILED]: '取消学习状态失败',
  [ResponseCode.GET_EXE_LEARNING_STATUS_FAILED]: '获取学习状态失败',

  // 练习收藏状态相关 (43013-43018)
  [ResponseCode.FAVORITE_EXERCISE_FAILED]: '收藏练习失败',
  [ResponseCode.UNFAVORITE_EXERCISE_FAILED]: '取消收藏练习失败',
  [ResponseCode.GET_EXE_FAV_STATUS_FAILED]: '获取收藏状态失败',

  // 音频相关
  [ResponseCode.CREATE_AUDIO_FAILED]: '创建音频失败',
  [ResponseCode.GET_AUDIO_FAILED]: '获取音频失败',
  [ResponseCode.GET_ALL_AUDIOS_FAILED]: '获取所有音频失败',
  [ResponseCode.UPDATE_AUDIO_FAILED]: '更新音频失败',
  [ResponseCode.DELETE_AUDIO_FAILED]: '删除音频失败',
  [ResponseCode.FAVORITE_AUDIO_FAILED]: '收藏音频失败',
  [ResponseCode.UNFAVORITE_AUDIO_FAILED]: '取消收藏音频失败',
  [ResponseCode.GET_FAVORITE_AUDIO_STATUS_FAILED]: '获取音频收藏状态失败',

  // 通用错误
  [ResponseCode.INVALID_PARAM]: '无效的请求参数',
  
  // 服务器错误
  [ResponseCode.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ResponseCode.DATABASE_ERROR]: '数据库操作失败',

  // 外部接口错误
  [ResponseCode.WX_LOGIN_FAILED]: '微信登录失败',
  [ResponseCode.S3_UPLOAD_FAILED]: 'S3上传失败',
  [ResponseCode.S3_DELETE_FAILED]: 'S3删除失败',
  [ResponseCode.S3_GET_FAILED]: 'S3获取失败',
  [ResponseCode.S3_POST_FAILED]: 'S3创建失败',
  [ResponseCode.S3_PATCH_FAILED]: 'S3更新失败',
};