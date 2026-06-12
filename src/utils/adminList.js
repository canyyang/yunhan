import { getStudentStatus } from '@/composables/studentStatus'

export function sortStudentsForList(list) {
  const priority = (student) => {
    const status = getStudentStatus(student)
    if (status === 'waitingHouse') return 0
    if (status === 'waitingTeacher') return 1
    return 2
  }

  return [...list].sort((a, b) => {
    const diff = priority(a) - priority(b)
    if (diff !== 0) return diff
    return Number(b.id) - Number(a.id)
  })
}

export function sortTeachersByIdDesc(list) {
  return [...list].sort((a, b) => Number(b.id) - Number(a.id))
}

export function filterStudents(list, filter) {
  return list.filter((student) => {
    if (filter.id && !String(student.id).includes(String(filter.id))) return false
    if (filter.name && !student.name?.includes(filter.name)) return false
    if (filter.charge && student.charge !== filter.charge) return false
    if (filter.teacher === '未分配' && student.teacher !== '未分配') return false
    if (filter.teacher === '已分配' && student.teacher === '未分配') return false
    if (filter.area && student.area !== filter.area) return false
    if (filter.address && !student.address?.includes(filter.address)) return false
    return true
  })
}

function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function includesAll(source, targets) {
  if (!targets?.length) return true
  return targets.every((item) => normalizeList(source).includes(item))
}

export function filterTeachers(list, filter) {
  return list.filter((teacher) => {
    if (filter.id && !String(teacher.id).includes(String(filter.id))) return false
    if (filter.name && !teacher.name?.includes(filter.name)) return false
    if (filter.sex && teacher.sex !== filter.sex) return false
    if (filter.address && !teacher.address?.includes(filter.address)) return false
    if (!includesAll(teacher.subject, filter.subject)) return false
    if (!includesAll(teacher.grade, filter.grade)) return false
    if (!includesAll(teacher.area, filter.area)) return false
    return true
  })
}

export function paginateList(list, pageNum, pageSize) {
  const start = (pageNum - 1) * pageSize
  return list.slice(start, start + pageSize)
}

export function formatTeacherForDrawer(teacher) {
  const subject = Array.isArray(teacher.subject) ? teacher.subject : []
  const grade = Array.isArray(teacher.grade) ? teacher.grade : []
  const area = Array.isArray(teacher.area) ? teacher.area : []
  const student = Array.isArray(teacher.student) ? teacher.student : []

  return {
    ...teacher,
    subject,
    grade,
    area,
    student,
    subjectText: subject.join('、'),
    gradeText: grade.join('、'),
    areaText: area.join('、'),
    studentText: student.join('、'),
  }
}
