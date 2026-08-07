import api from "@/lib/axios";

export async function loginAdmin(email: string, password: string) {
  try {
     const { data } = await api.post("/auth/login", {
        email,
        password,
     })  ;

       return data;

  } catch (error) {
    console.log(error);
  }

}

export async function getAdmin() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logoutAdmin() {
  const { data } = await api.post("/auth/logout");
  return data;
}