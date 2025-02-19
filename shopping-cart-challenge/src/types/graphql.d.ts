export type CartItem = {
  _id: string;
  cartId: string;
  product: Product;
  quantity: number;
  updatedAt: string;
  addedAt: string;
};

export type Product = {
  _id: string;
  title: string;
  cost: number;
  availableQuantity: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Cart = {
  _id: string;
  hash: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type Visitor = {
  _id: string;
  token: string;
  cartId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItemMessage = {
  event: 'ITEM_QUANTITY_UPDATED' | 'ITEM_OUT_OF_STOCK';
  payload: CartItem;
};

export type GetProductsData = {
  products: Product[];
  total: number;
};
