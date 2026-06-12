import { ElLoading, ElMessage } from "element-plus";

export function getStage() {
  const start = new Date('2013-06-01')
  const now = new Date()

  let years = now.getFullYear() - start.getFullYear()

  if (now.getMonth() < start.getMonth()) {
    years--
  }

  return years + 1
}

/** 编号前两位表示期数 */
export function getStageFromId(id) {
  const str = String(id ?? '')
  if (str.length < 2) return null
  return parseInt(str.slice(0, 2), 10)
}

export function isCurrentStage(id, stage = getStage()) {
  return getStageFromId(id) === stage
}

/** 编号后三位表示当期内序号 */
export function getSequenceFromId(id) {
  const str = String(id ?? '')
  if (str.length <= 2) return 0
  return parseInt(str.slice(2), 10) || 0
}

/** 从列表中取本期最大学员编号，推算当期内人数（需后端按编号降序返回第一页） */
export function getCurrentStageCountFromIds(list, stage = getStage()) {
  let maxId = 0
  for (const item of list) {
    if (!isCurrentStage(item?.id, stage)) continue
    const num = Number(item.id)
    if (num > maxId) maxId = num
  }
  return maxId > 0 ? getSequenceFromId(maxId) : 0
}

export function sortByCurrentStageFirst(list, stage = getStage()) {
  return [...list].sort((a, b) => {
    const aCurrent = isCurrentStage(a.id, stage) ? 0 : 1
    const bCurrent = isCurrentStage(b.id, stage) ? 0 : 1
    if (aCurrent !== bCurrent) return aCurrent - bCurrent
    return Number(b.id) - Number(a.id)
  })
}

export function filterCurrentStage(list, stage = getStage()) {
  return list.filter((item) => isCurrentStage(item.id, stage))
}

export async function charge(loadingText, data, chargeFn, successText, successFn) {
  const loading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    await chargeFn(data)
    ElMessage({
      message: successText,
      type: 'success',
    })
    successFn()
  } catch (error) {
    ElMessage({
      message: '网络错误',
      type: 'error',
    })
  } finally {
    loading.close()
  }
}