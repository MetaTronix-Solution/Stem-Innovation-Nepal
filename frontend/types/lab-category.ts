export interface LabCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabCategoryData {
  name: string;
  description?: string;
}

export interface LabCategoryResponse {
  message: string;
  category: LabCategory;
}

export interface LabCategoriesResponse {
  message: string;
  categories: LabCategory[];
}