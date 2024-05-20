import { ILoginRequest, ILoginResponse } from '@/models/auth';
import { ICreateCustomer, ICustomer } from '@/models/customer';
import { ILicenseResponse } from '@/models/license';
import { IMenuResponse } from '@/models/menu';
import {
  IOrderCreateRequest,
  IOrderItemsCreateRequest,
  IOrderItemUpdateRequest,
  IOrderResponse,
  IOrderUpdateRequest,
} from '@/models/order';
import { IShopResponse } from '@/models/shop';
import {
  IPrintBillPayload,
  IPrintTicketRequest,
  IPrinter,
} from '@/models/printer';

import axios from 'axios';
import {
  IBillResponse,
  ICreateBillRequest,
  ICreatePaymentRequest,
  ICreatePaymentResponse,
} from '@/models/billing';

const serverUrl = '/api';

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.Authorization =
      'bearer ' + localStorage.getItem('posxAccessToken');
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const login = (apiArgs: ILoginRequest) =>
  axios.post<ILoginResponse>(`${serverUrl}/auth/login`, apiArgs);

// export const logout = () =>
//   http.post<{}, {}>(`${serverUrl}/auth/logout`, { credentials: 'include' });

export const userInfo = () => axios.get(`${serverUrl}/user/info`);

export const getActiveLicenses = () =>
  axios.get<{ license: ILicenseResponse; valid: boolean }[]>(
    `${serverUrl}/license`,
  );

export const validateLicense = (apiArgs: { number: string }) =>
  axios.post<{ license: ILicenseResponse; valid: boolean }>(
    `${serverUrl}/license/validate`,
    apiArgs,
  );

export const fetchShopDetails = (shopId: string) =>
  axios.get<IShopResponse>(`${serverUrl}/shop/${shopId}`);

export const fetchCustomerDetails = (apisArgs: {
  id?: string;
  contactNo?: string;
}) => axios.get<ICustomer>(`${serverUrl}/customer`, { params: apisArgs });

export const createCustomer = (payload: ICreateCustomer) =>
  axios.post<ICustomer>(`${serverUrl}/customer`, payload);

export const getMenuByShop = (shopId: string) =>
  axios.get<IMenuResponse>(`${serverUrl}/menu/${shopId}`);

export const createOrder = (apiArgs: IOrderCreateRequest) =>
  axios.post<IOrderResponse>(`${serverUrl}/order`, apiArgs);

export const updateOrder = (apiArgs: IOrderUpdateRequest) =>
  axios.put<IOrderResponse>(`${serverUrl}/order`, apiArgs);

export const getOrderById = (orderId: string) =>
  axios.get<IOrderResponse>(`${serverUrl}/order/${orderId}`);

export const getAllOrder = (apiArgs: {
  shopId: string;
  orderStatusId?: number;
  isClosed?: boolean;
  skip: number;
  take: number;
}) =>
  axios.get<{ orders: IOrderResponse[]; count: number }>(`${serverUrl}/order`, {
    params: apiArgs,
  });

export const createNewOrderItems = (
  orderId: string,
  apiArgs: { items: IOrderItemsCreateRequest[] },
) => axios.post<IOrderResponse>(`${serverUrl}/order/${orderId}/items`, apiArgs);

export const updateOrderItem = (apiArgs: IOrderItemUpdateRequest) =>
  axios.put(`${serverUrl}/order/item`, apiArgs);

export const printTicket = (apiArgs: IPrintTicketRequest) =>
  axios.post(`http://localhost:8080/api/printer/print/ticket`, apiArgs);

export const printBill = (apiArgs: IPrintBillPayload) =>
  axios.post(`http://localhost:8080/api/printer/print/bill`, apiArgs);

export const createBill = (apiArgs: ICreateBillRequest) =>
  axios.post<IBillResponse>(`${serverUrl}/billing`, apiArgs);

export const getActiveBill = (orderId: string) =>
  axios.get<IBillResponse>(`${serverUrl}/billing/${orderId}`);

export const capturePayment = (apiArgs: ICreatePaymentRequest) =>
  axios.post<ICreatePaymentResponse>(`${serverUrl}/payment`, apiArgs);

export const getPrinters = () =>
  axios.get<IPrinter[]>(`http://localhost:8080/api/printer`);

export const getPrinterStatus = (apiArgs: { type: string; value: string }) =>
  axios.get<{ status: boolean }>(`http://localhost:8080/api/printer/status`, {
    params: apiArgs,
  });
