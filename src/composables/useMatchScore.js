function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split(/[,，、\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getGradeStage(grade = '') {
  if (grade.includes('小')) return '小学'
  if (grade.includes('初')) return '初中'
  if (grade.includes('高')) return '高中'
  return ''
}

function getAreaMatch(student, teacherAreas) {
  const studentArea = String(student.area ?? '').trim()
  if (studentArea) {
    if (teacherAreas.includes(studentArea)) {
      return { hit: studentArea, bonus: 30, exact: true }
    }
    return null
  }

  const addressHit = teacherAreas.find((area) => student.address?.includes(area))
  if (addressHit) {
    return { hit: addressHit, bonus: 20, exact: false }
  }
  return null
}

export function calculateMatchScore(student, teacher) {
  if (!student || !teacher) {
    return { score: 0, reasons: [] }
  }

  let score = 20
  const reasons = []
  const studentSubjects = normalizeList(student.need)
  const teacherSubjects = normalizeList(teacher.subject)
  const subjectHits = studentSubjects.filter((subject) => teacherSubjects.includes(subject))

  if (teacherSubjects.includes('全科')) {
    score += 25
    reasons.push('可授全科')
  } else if (subjectHits.length > 0) {
    score += Math.min(35, subjectHits.length * 18)
    reasons.push(`科目匹配：${subjectHits.join('、')}`)
  }

  const stage = getGradeStage(student.grade)
  if (stage && normalizeList(teacher.grade).includes(stage)) {
    score += 22
    reasons.push(`年级匹配：${stage}`)
  }

  const teacherAreas = normalizeList(teacher.area)
  const areaMatch = getAreaMatch(student, teacherAreas)
  if (areaMatch) {
    score += areaMatch.bonus
    reasons.push(areaMatch.exact ? `区域一致：${areaMatch.hit}` : `地区匹配：${areaMatch.hit}`)
  }

  const studentCount = Array.isArray(teacher.student) ? teacher.student.length : normalizeList(teacher.student).length
  if (studentCount === 0) {
    score += 12
    reasons.push('当前空闲')
  } else if (studentCount <= 2) {
    score += 8
    reasons.push('负荷较低')
  }

  return {
    score: Math.min(100, score),
    reasons,
  }
}
