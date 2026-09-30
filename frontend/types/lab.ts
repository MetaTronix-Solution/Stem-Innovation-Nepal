import { LabItem } from "./lab-item";

export interface Lab {
  _id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  labItems: string[] | LabItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabData {
  title: string;
  description: string;
  price: number;
  labItems: string[];
  image?: File;
}

export interface UpdateLabData {
  title?: string;
  description?: string;
  price?: number;
  labItems?: string[];
  image?: File;
}

export interface LabResponse {
  message: string;
  lab: Lab;
}

export interface LabsResponse {
  message: string;
  labs: Lab[];
}