export type CartItemType = "lab" | "lab-item";

export interface CartItem {
  id: string;
  type: CartItemType;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}