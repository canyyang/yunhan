export function getStudentStatus(student) {
  if (student.charge === '等待分院') return 'waitingHouse'
  if (student.teacher === '未分配') return 'waitingTeacher'
  if (student.isPublic) return 'public'
  return 'assigned'
}
