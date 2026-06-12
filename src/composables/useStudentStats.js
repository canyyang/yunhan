import { computed } from 'vue'
import { SUBJECTS, getGradeCategory } from '@/constants'
import { useAdminDataset } from '@/composables/useAdminDataset'
import { getStudentStatus } from '@/composables/studentStatus'

function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export { getStudentStatus } from '@/composables/studentStatus'

export function useStudentStats() {
  const { stage, students, loading, fetchDataset } = useAdminDataset()

  const stats = computed(() => {
    const base = {
      stage: stage.value,
      total: students.value.length,
      waitingHouse: 0,
      waitingTeacher: 0,
      assigned: 0,
      public: 0,
      gradeCounts: {
        小学: 0,
        初中: 0,
        高中: 0,
        其他: 0,
      },
      subjectCounts: Object.fromEntries(SUBJECTS.map((subject) => [subject, 0])),
    }

    students.value.forEach((student) => {
      const status = getStudentStatus(student)
      base[status] += 1

      const category = getGradeCategory(student.grade)
      base.gradeCounts[category] += 1

      normalizeList(student.need).forEach((subject) => {
        if (base.subjectCounts[subject] !== undefined) {
          base.subjectCounts[subject] += 1
        }
      })
    })

    return base
  })

  return {
    loading,
    students,
    stats,
    refresh: fetchDataset,
  }
}
