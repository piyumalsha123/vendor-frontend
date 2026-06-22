import api from "./api"

export const register = async (
  name: string,
  email: string,
  password: string,
  roles :string[],
  storeName :string,
  phone: string,     
  address: string
) => {
  const res = await api.post("/auth/register", { name, email, password,roles,storeName,phone,address })
  return res.data
}

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })
  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}
