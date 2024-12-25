import { ElLoading, ElMessage } from "element-plus";

export function getStage() {
  const start = new Date('2013-04-01')
  const now = new Date()

  let years = now.getFullYear() - start.getFullYear();
  
  if (now.getMonth() < start.getMonth()) {
    years--
  }

  return years + 1
}

export async function charge(loadingText, data, chargeFn, successText, successFn) {
  const loading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    await chargeFn(data);
    ElMessage({
    message: successText,
    type: 'success',
    })
  } catch (error) {
    console.log(error)
    ElMessage({
      message: '网络错误',
      type: 'error',
    })
  } finally {
    loading.close()
    successFn()
  }
}