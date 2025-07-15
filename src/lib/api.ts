import axios from "axios";

//
// 🔹 Interface Project
//
export interface Project {
  _id?: string;
  name: string;
  location: string;
  price: string;
  image: string;
  label: string;
  labelColor: string;
}

//
// 🔹 Interface Property (nếu cần dùng chung)
//
export interface Property {
  _id?: string;
  title: string;
  price: string;
  area: string;
  date: string;
  type: string;
  image: string;
  status?: string;
  ownerId?: string;
}

//
// 🔹 Interface User
//
export interface User {
  _id?: string;
  name: string;
  email: string;
  token?: string;
}

//
// 🔸 PROJECT API
//

// GET /api/projects
export async function fetchProjects(): Promise<Project[]> {
  const res = await axios.get("http://localhost:5000/api/projects");
  return res.data as Project[];
}

// POST /api/projects
export async function postProject(project: Project): Promise<Project> {
  const res = await axios.post("http://localhost:5000/api/projects", project);
  return res.data as Project;
}

// GET /api/projects/:id
export async function getProjectById(id: string): Promise<Project> {
  const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
  return res.data as Project;
}

//
// 🔸 USER API
//

// POST /api/auth/login
export async function loginUser(credentials: { email: string; password: string }): Promise<User> {
  const res = await axios.post("http://localhost:5000/api/auth/login", credentials);
  return res.data as User;
}

// POST /api/auth/register
export async function registerUser(info: { name: string; email: string; password: string }): Promise<User> {
  const res = await axios.post("http://localhost:5000/api/auth/register", info);
  return res.data as User;
}

// GET user info từ token (nếu có route riêng)
export async function getUserFromToken(token: string): Promise<User> {
  const res = await axios.get("http://localhost:5000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as User;
}
export async function fetchProperties(): Promise<Property[]> {
  const res = await axios.get("http://localhost:5000/api/properties");
  return res.data as Property[];
}
