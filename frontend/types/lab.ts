export interface LabCategory {
  _id: string;
  name: string;
}

export interface LabItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  specification: string;
  quantity: number;
  category: string | LabCategory;
}

export interface Lab {
  _id: string;
  title: string;
  labItems: LabItem[];
}