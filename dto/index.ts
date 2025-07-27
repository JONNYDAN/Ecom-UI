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