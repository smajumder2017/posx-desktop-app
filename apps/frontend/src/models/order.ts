import { IUserInfoResponse } from './auth';
import { ICustomer } from './customer';

export interface IOrderCreateRequest {
  shopId: string;
  customerId?: string;
  employeeId?: string;
  items?: IOrderItemsCreateRequest[] | null;
}
export interface IOrderItemsCreateRequest {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
}

export interface IOrderItemUpdateRequest {
  id: string;
  itemId?: string;
  itemName?: string;
  price?: number;
  quantity?: number;
  rejectionReason?: string;
}

export interface IOrderResponse {
  id: string;
  orderNumber: string;
  shopId: string;
  customerId: string;
  employeeId?: null;
  isActive: boolean;
  isSynced: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  items?: IOrderItemsResponse[] | null;
  orderStatus?: IOrderStatus;
  employee?: IUserInfoResponse;
  customer?: ICustomer;
}

interface IOrderStatus {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}
export interface IOrderItemsResponse {
  id: string;
  orderId: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  rejectionReason?: null;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderUpdateRequest {
  id: string;
  shopId?: string;
  customerId?: string;
  employeeId?: string;
  cancellationReason?: string;
  isClosed?: boolean;
  orderStatusId?: number;
}
