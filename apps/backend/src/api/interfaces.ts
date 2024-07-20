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
