import { ref } from 'vue'
import { getAdminDataset } from '@/services'

const STORAGE_KEY = 'yunhan_admin_dataset'

const stage = ref(0)
const updatedAt = ref(0)
const students = ref([])
const teachers = ref([])
const loading = ref(false)
const initialized = ref(false)

function persist() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
    stage: stage.value,
    updatedAt: updatedAt.value,
    students: students.value,
    teachers: teachers.value,
  }))
}

function applyPayload(data) {
  stage.value = data.stage ?? 0
  updatedAt.value = data.updatedAt ?? Date.now()
  students.value = data.students ?? []
  teachers.value = data.teachers ?? []
  initialized.value = true
  persist()
}

export function hydrateAdminDatasetFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    applyPayload(JSON.parse(raw))
    return true
  } catch {
    return false
  }
}

export async function fetchAdminDataset(force = false) {
  if (!force && hydrateAdminDatasetFromStorage()) {
    return { stage: stage.value, students: students.value, teachers: teachers.value }
  }

  loading.value = true
  try {
    const data = await getAdminDataset()
    applyPayload(data)
    return data
  } finally {
    loading.value = false
  }
}

export async function ensureAdminDataset() {
  if (initialized.value) return
  if (hydrateAdminDatasetFromStorage()) return
  await fetchAdminDataset(true)
}

export function getStudentById(id) {
  return students.value.find((item) => String(item.id) === String(id))
}

export function getTeacherById(id) {
  return teachers.value.find((item) => String(item.id) === String(id))
}

export function useAdminDataset() {
  return {
    stage,
    updatedAt,
    students,
    teachers,
    loading,
    initialized,
    fetchDataset: fetchAdminDataset,
    ensureDataset: ensureAdminDataset,
    hydrateFromStorage: hydrateAdminDatasetFromStorage,
    getStudentById,
    getTeacherById,
  }
}
