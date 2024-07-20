export interface IShopResponse {
  id: string;
  shopName: string;
  shopCode: string;
  shopTypeId: number;
  registrationNo: string;
  isActive: boolean;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  gstinNo?: string;
  cgstPercentage?: number;
  sgstPercentage?: number;
  serviceChargePercentage?: number;
  createdAt: string;
  updatedAt: string;
  shopType: ShopType;
}
export interface ShopType {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDeliveryConfig {
  enabled: boolean;
  serviceRadius: number;
  deliveryCharges: Array<{ distance: number; amount: number }>;
}

export interface IShopConfigRequest {
  id?: string;
  shopId: string;
  config: {
    delivery: IDeliveryConfig;
  };
}

export interface IShopConfigResponse extends IShopConfigRequest {
  id: string;
}
