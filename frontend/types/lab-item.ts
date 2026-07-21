export type LabCategory = {
  _id: string;
  name: string;
};

export type LabItem = {
  _id: string;
  title: string;
  description: string;
  specification: string;
  price: number;
  quantity: number;
  image: string;
  category: LabCategory | string;
  createdAt: string;
  updatedAt: string;
};
