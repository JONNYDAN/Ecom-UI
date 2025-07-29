export interface IProduct {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  _type: 'product';
  images: string[]; // Thay đổi từ image sang images và luôn là mảng
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  price: number;
  details: string;
  description?: string;
  quantity: number; // Thêm vào nếu cần
}

export interface IBanner {
  _id: string;
  images: string[];
  buttonText: string;
  product: string;
  desc: string;
  smallText: string;
  midText: string;
  largeText1: string;
  largeText2: string;
  discount: string;
  saleTime: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  _id?: string;
  stripeSessionId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}