import axios from "./axios"

export async function login(password) {
  try {
    const res = await axios.post('/login', {
      password: password
    })
    console.log(res)
    return res;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function getStudentList(formInline, pageNum) {
  try {
    const res = await axios.post('/student/get', {
      filter: formInline,
      pageNum: pageNum
    })
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function getStudentDetail(id) {
  try {
    const res = await axios.get(`/student/getDetail?id=${id}`);
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function getPublicStudent() {
  try {
    const res = await axios.get('/student/public');
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}



export async function getTeacherList(data) {
  try {
    const res = await axios.post('/teacher/get', data);
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function getTeacherDetail(id) {
  try {
    const res = await axios.get(`/teacher/getDetail?id=${id}`);
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function deleteTeacher(data) {
  const { id } = data
  try {
    const res = await axios.get(`/teacher/delete?id=${id}`);
    console.log(res)
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function addTeacher(data) {
  return axios.post('/teacher/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("网络异常", error);
      throw error;
    });
}

export async function addStudent(data) {
  return axios.post('/student/add', data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("网络异常", error);
      throw error;
    });
}

export async function publicStudent(data) {
  return axios.post('/student/setPublic', data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("网络异常", error);
      throw error;
    });
}

export async function deleteStudent(data) {
  const { id } = data
  try {
    const res = await axios.get(`/student/delete?id=${id}`);
    return res.data;
  } catch (error) {
    console.error("网络异常", error);
    throw error;
  }
}

export async function editCharge(data) {
  return axios.post('/student/edit/charge', data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("网络异常", error);
      throw error;
    });
}

export async function chargeStudent(data) {
  console.log(data)
  return axios.post('/student/edit/teacher', data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("网络异常", error);
      throw error;
    });
}

