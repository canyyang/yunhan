import axios from "./axios"

async function unwrapData(promise) {
  const res = await promise
  return res.data
}

export async function login(password) {
  return axios.post('/login', { password })
}

export async function getStudentList(formInline, pageNum) {
  return unwrapData(axios.post('/student/get', {
    filter: formInline,
    pageNum,
  }))
}

export async function getStudentDetail(id) {
  return unwrapData(axios.get(`/student/getDetail?id=${id}`))
}

export async function getPublicStudent() {
  return unwrapData(axios.get('/student/public'))
}

export async function getTeacherList(formInline, pageNum) {
  return unwrapData(axios.post('/teacher/get', {
    filter: formInline,
    pageNum,
  }))
}

export async function getTeacherDetail(id) {
  return unwrapData(axios.get(`/teacher/getDetail?id=${id}`))
}

export async function deleteTeacher(data) {
  const { id } = data
  return unwrapData(axios.get(`/teacher/delete?id=${id}`))
}

export async function addTeacher(data) {
  return unwrapData(axios.post('/teacher/add', data))
}

export async function addStudent(data) {
  return unwrapData(axios.post('/student/add', data))
}

export async function publicStudent(data) {
  return unwrapData(axios.post('/student/setPublic', data))
}

export async function deleteStudent(data) {
  const { id } = data
  return unwrapData(axios.get(`/student/delete?id=${id}`))
}

export async function editCharge(data) {
  return unwrapData(axios.post('/student/edit/charge', data))
}

export async function chargeStudent(data) {
  return unwrapData(axios.post('/student/edit/teacher', data))
}
