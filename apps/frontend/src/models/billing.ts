export interface ICreateBillRequest {
  orderId: string;
  customerId: string;
  employeeId: string;
  shopId: string;
  amount: number;
  discount: number;
  gst: number;
  serviceCharges: number;
}

export interface IBillResponse {
  id: string;
  orderId: string;
  shopId: string;
  customerId: string;
  employeeId: string;
  isActive: boolean;
  isSetteled: boolean;
  isSynced: boolean;
  amount: number;
  discount: number;
  gst: number;
  serviceCharges: number;
  totalAmount: number;
  roundoffDiff: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePaymentRequest {
  billId: string;
  amountRecieved: number;
  paymentMode: string;
}

export interface ICreatePaymentResponse {
  id: string;
  billId: string;
  amountRecieved: number;
  paymentMode: string;
  createdAt: string;
  updatedAt: string;
}