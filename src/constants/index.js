export const HOUSES = ['斯莱特林', '格兰芬多', '拉文克劳', '赫奇帕奇']

export const CHARGE_COLORS = {
  '等待分院': '#000000',
  '斯莱特林': '#2A623D',
  '格兰芬多': '#9C2D2F',
  '拉文克劳': '#0E1A8C',
  '赫奇帕奇': '#F1C232',
}

export const SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '政治', '地理']

export const TEACHER_SUBJECTS = [...SUBJECTS, '全科']

export const AREAS = ['榕城', '东山', '蓝城', '渔湖', '梅云', '仙桥', '曲溪', '埔田', '云路', '锡场', '炮台', '玉滘', '揭西', '惠来', '其他']

export const STUDENT_GRADES = ['小学', '初一', '初二', '初三', '高一', '高二', '高三', '其他']

export const TEACH_GRADES = ['小学', '初中', '高中']

export const STUDENT_SOURCES = ['传单', '亲友', '微信', '回头客']

export const TEACHER_FILTER_OPTIONS = ['未分配', '已分配']

export function getChargeColor(charge) {
  const color = CHARGE_COLORS[charge]
  return color ? `color: ${color};` : ''
}
