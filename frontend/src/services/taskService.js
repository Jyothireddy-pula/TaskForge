import axios from "axios"

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
const API_URL = `${API_BASE}/api/tasks`

const withAuth = () => {
  const token = localStorage.getItem("authToken")
  if (!token) return {}
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const getTasks = () => axios.get(API_URL, withAuth())

export const createTask = (task) =>
  axios.post(API_URL, task, withAuth())

export const updateTask = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, withAuth())

export const deleteTask = (id) =>
  axios.delete(`${API_URL}/${id}`, withAuth())

export const uploadAttachment = (id, file) => {
  const formData = new FormData()
  formData.append("file", file)
  return axios.post(`${API_URL}/${id}/attachment`, formData, {
    ...withAuth(),
    headers: {
      ...(withAuth().headers || {}),
      "Content-Type": "multipart/form-data"
    }
  })
}
