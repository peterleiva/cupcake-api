export interface ProductDTO {
  name: string;
  price: number;
  category: string;
  description?: string;
  thumbnail?: Buffer;
}
