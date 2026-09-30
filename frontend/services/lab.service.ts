import axios from "@/lib/axios";

import {

} from "@/types/lab";
import { LabItemResponse, LabItemsResponse } from "@/types/lab-item";


// GET ALL
export const getLabs =
  async (): Promise<LabItemsResponse> => {
    const response = await axios.get(
      "/lab",
    );

    return response.data;
  };


// GET ONE
export const getLab =
  async (
    id: string,
  ): Promise<LabItemResponse> => {
    const response = await axios.get(
      `/lab/${id}`,
    );

    return response.data;
  };


// CREATE
export const createLab =
  async (
    formData: FormData,
  ): Promise<LabItemResponse> => {
    const response = await axios.post(
      "/lab",
      formData,
    );

    return response.data;
  };


// UPDATE
export const updateLab =
  async (
    id: string,
    formData: FormData,
  ): Promise<LabItemResponse> => {
    const response = await axios.patch(
      `/lab/${id}`,
      formData,
    );

    return response.data;
  };


// DELETE
export const deleteLab =
  async (id: string) => {
    const response = await axios.delete(
      `/lab/${id}`,
    );

    return response.data;
  };