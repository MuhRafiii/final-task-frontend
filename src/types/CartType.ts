export type CartItem = {
  id: number;
  name: string;
  picture: string;
  price: number;
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  idCounter: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  cartLoading: boolean;
};
