import axios from "@/lib/axios";

import {
  LabItemResponse,
  LabItemsResponse,
} from "@/types/lab-item";


// GET ALL
export const getLabItems =
  async (): Promise<LabItemsResponse> => {
    const response = await axios.get(
      "/lab-item",
    );

    return response.data;
  };


// GET ONE
export const getLabItem =
  async (
    id: string,
  ): Promise<LabItemResponse> => {
    const response = await axios.get(
      `/lab-item/${id}`,
    );

    return response.data;
  };


// CREATE
export const createLabItem =
  async (
    formData: FormData,
  ): Promise<LabItemResponse> => {
    const response = await axios.post(
      "/lab-item",
      formData,
    );

    return response.data;
  };


// UPDATE
export const updateLabItem =
  async (
    id: string,
    formData: FormData,
  ): Promise<LabItemResponse> => {
    const response = await axios.patch(
      `/lab-item/${id}`,
      formData,
    );

    return response.data;
  };


// DELETE
export const deleteLabItem =
  async (id: string) => {
    const response = await axios.delete(
      `/lab-item/${id}`,
    );

    return response.data;
  };