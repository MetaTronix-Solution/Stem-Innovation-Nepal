import api from "@/lib/axios";

export const getLabs = async () => {
  const { data } = await api.get("/lab");
  return data;
};

export const getLab = async (id: string) => {
  const { data } = await api.get(`/lab/${id}`);
  return data;
};

export const createLab = async (formData: FormData) => {
  const { data } = await api.post("/lab", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateLab = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/lab/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteLab = async (id: string) => {
  const { data } = await api.delete(`/lab/${id}`);
  return data;
};

export const getLabItems = async () => {
  const { data } = await api.get("/lab-item");
  return data;
};