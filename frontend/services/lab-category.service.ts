import axios from "@/lib/axios";

import {
  CreateLabCategoryData,
  LabCategoriesResponse,
  LabCategoryResponse,
} from "@/types/lab-category";


// GET ALL
export const getLabCategories =
  async (): Promise<LabCategoriesResponse> => {
    const response = await axios.get(
      "/lab-category",
    );

    return response.data;
  };


// GET ONE
export const getLabCategory =
  async (
    id: string,
  ): Promise<LabCategoryResponse> => {
    const response = await axios.get(
      `/lab-category/${id}`,
    );

    return response.data;
  };


// CREATE
export const createLabCategory =
  async (
    data: CreateLabCategoryData,
  ): Promise<LabCategoryResponse> => {
    const response = await axios.post(
      "/lab-category",
      data,
    );

    return response.data;
  };


// UPDATE
export const updateLabCategory =
  async (
    id: string,
    data: CreateLabCategoryData,
  ): Promise<LabCategoryResponse> => {
    const response = await axios.patch(
      `/lab-category/${id}`,
      data,
    );

    return response.data;
  };


// DELETE
export const deleteLabCategory =
  async (id: string) => {
    const response = await axios.delete(
      `/lab-category/${id}`,
    );

    return response.data;
  };