export interface IPrintTicketRequest {
  interface: string;
  orderNumber: string;
  shopName: string;
  orderItems: IOrderItems[];
}

interface IOrderItems {
  itemName: string;
  quantity: number;
  price?: number;
}

export interface IGst {
  gstNumber: string;
  percentage: string;
  amount: number;
}

export interface IDiscount {
  percentage: string;
  amount: number;
}

export interface IPrintBillPayload {
  interface: string;
  shopName: string;
  shopAddress: string;
  shopContact: string;
  employeeName: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  serviceCharge?: number;
  gst?: IGst;
  discount?: IDiscount;
  containerCharge?: number;
  orderItems: IOrderItems[];
  totalQty: number;
  grandTotal: number;
  amount: number;
  roundOff: number;
}
