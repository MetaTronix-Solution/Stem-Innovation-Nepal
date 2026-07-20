import { Blog } from "@/types/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message || `Request failed with status ${res.status}`,
    );
  }
  return res.json();
}

export const blogService = {
  //Public
  async getAll(): Promise<Blog[]> {
    const res = await fetch(`${API_URL}/blog`, { cache: "no-store" });
    return handleResponse(res);
  },

  async getOne(id: string): Promise<Blog | null> {
    const res = await fetch(`${API_URL}/blog/${id}`, { cache: "no-store" });
    if (res.status === 404) return null;
    return handleResponse(res);
  },

  //Admin
  async getAllAdmin(): Promise<Blog[]> {
    const res = await fetch(`${API_URL}/blog/admin/all`, {
      cache: "no-store",
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getOneAdmin(id: string): Promise<Blog> {
    const res = await fetch(`${API_URL}/blog/admin/${id}`, {
      cache: "no-store",
      credentials: "include",
    });
    return handleResponse(res);
  },

  async create(data: {
    title: string;
    content: string;
    published: boolean;
    image: File;
  }) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("published", String(data.published));
    formData.append("image", data.image);

    const res = await fetch(`${API_URL}/blog`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    return handleResponse(res);
  },

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      published?: boolean;
      image?: File;
    },
  ) {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.published !== undefined)
      formData.append("published", String(data.published));
    if (data.image) formData.append("image", data.image);

    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });
    return handleResponse(res);
  },

  async remove(id: string) {
    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(res);
  },
};
