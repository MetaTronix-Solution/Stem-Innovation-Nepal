import { LabItem } from "@/types/lab-item";

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

export const labItemService = {
  async getAll(): Promise<LabItem[]> {
    const res = await fetch(`${API_URL}/lab-item`, {
      cache: "no-store",
      credentials: "include",
    });
    const data = await handleResponse(res);
    return data.items ?? [];
  },

  async create(data: {
    title: string;
    description: string;
    specification: string;
    price: number;
    quantity: number;
    category: string;
    image: File;
  }) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("specification", data.specification);
    formData.append("price", String(data.price));
    formData.append("quantity", String(data.quantity));
    formData.append("category", data.category);
    formData.append("image", data.image);

    const res = await fetch(`${API_URL}/lab-item`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    return handleResponse(res);
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      specification: string;
      price: number;
      quantity: number;
      category: string;
      image: File;
    }>,
  ) {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.specification)
      formData.append("specification", data.specification);
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.quantity !== undefined)
      formData.append("quantity", String(data.quantity));
    if (data.category) formData.append("category", data.category);
    if (data.image) formData.append("image", data.image);

    const res = await fetch(`${API_URL}/lab-item/${id}`, {
      method: "PUT", // your controller uses PUT, not PATCH
      body: formData,
      credentials: "include",
    });
    return handleResponse(res);
  },

  async remove(id: string) {
    const res = await fetch(`${API_URL}/lab-item/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(res);
  },
};
