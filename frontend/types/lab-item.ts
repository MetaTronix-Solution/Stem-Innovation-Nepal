import { LabCategory } from "./lab-category";

export interface LabItem {
  _id: string;
  title: string;
  description: string;
  specification: string;
  price: number;
  quantity: number;
  image?: string;
  category: string | LabCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabItemData {
  title: string;
  description: string;
  specification: string;
  price: number;
  quantity: number;
  category: string;
  image?: File;
}

export interface UpdateLabItemData {
  title?: string;
  description?: string;
  specification?: string;
  price?: number;
  quantity?: number;
  category?: string;
  image?: File;
}

export interface LabItemResponse {
  message: string;
  labItem: LabItem;
}

export interface LabItemsResponse {
  message: string;
  labItems: LabItem[];
}