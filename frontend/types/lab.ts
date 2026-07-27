export interface LabItem {
  _id: string;
  title: string;
}

export interface Lab {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  labItems: LabItem[];
}