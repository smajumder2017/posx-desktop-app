export interface IMenuResponse {
  menu: MenuEntity[];
}
export interface MenuEntity {
  id: string;
  categoryName: string;
  isActive: boolean;
  displayIndex: number;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItemsEntity[];
}
export interface MenuItemsEntity {
  id: string;
  itemName: string;
  shortCode: string;
  description: string;
  availability: boolean;
  isActive: boolean;
  foodType: string;
  price: number;
  waitingTime: number;
  spiceScale: string;
  servingTime: string;
  itemImageUrl: string;
  categoryId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}
