import { computed, ref } from 'vue'
import { getStudentList } from '@/services'
import { HOUSES, SUBJECTS } from '@/constants'

const CACHE_TTL = 60 * 1000
let cachedAt = 0
let cachedStudents = []

const emptyFilter = {
  id: '',
  name: '',
  charge: '',
  teacher: '',
  address: '',
}

export function getStudentStatus(student) {
  if (student.charge === '等待分院') return 'waitingHouse'
  if (student.teacher === '未分配') return 'waitingTeacher'
  if (student.isPublic) return 'public'
  return 'assigned'
}

function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

async function fetchAllStudents(force = false) {
  if (!force && cachedStudents.length && Date.now() - cachedAt < CACHE_TTL) {
    return cachedStudents
  }

  const firstPage = await getStudentList(emptyFilter, 1)
  const firstList = firstPage.list || []
  const total = firstPage.total || firstList.length
  const pageSize = firstList.length || 20
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const requests = []

  for (let page = 2; page <= pageCount; page += 1) {
    requests.push(getStudentList(emptyFilter, page))
  }

  const pages = await Promise.all(requests)
  cachedStudents = [
    ...firstList,
    ...pages.flatMap((page) => page.list || []),
  ].slice(0, total)
  cachedAt = Date.now()

  return cachedStudents
}

export function useStudentStats() {
  const loading = ref(false)
  const students = ref([])

  const refresh = async (force = false) => {
    loading.value = true
    try {
      students.value = await fetchAllStudents(force)
    } finally {
      loading.value = false
    }
  }

  const stats = computed(() => {
    const base = {
      total: students.value.length,
      waitingHouse: 0,
      waitingTeacher: 0,
      assigned: 0,
      public: 0,
      houseCounts: {
        等待分院: 0,
        ...Object.fromEntries(HOUSES.map((house) => [house, 0])),
      },
      subjectCounts: Object.fromEntries(SUBJECTS.map((subject) => [subject, 0])),
      todos: [],
    }

    students.value.forEach((student) => {
      const status = getStudentStatus(student)
      base[status] += 1
      if (student.charge && base.houseCounts[student.charge] !== undefined) {
        base.houseCounts[student.charge] += 1
      }
      normalizeList(student.need).forEach((subject) => {
        if (base.subjectCounts[subject] !== undefined) {
          base.subjectCounts[subject] += 1
        }
      })
    })

    base.todos = students.value
      .filter((student) => ['waitingHouse', 'waitingTeacher'].includes(getStudentStatus(student)))
      .slice(0, 8)

    return base
  })

  return {
    loading,
    students,
    stats,
    refresh,
  }
}
