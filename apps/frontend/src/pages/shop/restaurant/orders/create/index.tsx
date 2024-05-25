import OrderSummary from '../components/order-summary';
import Menu from '../components/menu';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import * as apis from '@/apis';
import { ICustomer } from '@/models/customer';
import { Badge } from '@/components/ui/badge';
import { MenuEntity } from '@/models/menu';
import { IOrderItemUpdateRequest, IOrderResponse } from '@/models/order';
import { useAppSelector } from '@/hooks/redux';
import { IPrintTicketRequest } from '@/models/printer';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import BillingForm, { IBillingFormPayload } from '../components/billing-form';
import { posXDB } from '@/db/db';
import { ICreateBillRequest } from '@/models/billing';

export default function CreateOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [, setLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer>();
  const [ticketItems, setTicketItems] = useState<{ [key: string]: number }>({});
  const { customerId, shopId } = useParams<{
    customerId: string;
    shopId: string;
  }>();
  const authState = useAppSelector((state) => state.auth);
  const shopState = useAppSelector((state) => state.shop);
  const [menu, setMenu] = useState<MenuEntity[]>([]);
  const [orderDetails, setOrderDetails] = useState<IOrderResponse>();
  const [itemToDelete, setItemToDelete] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [openBilling, setOpenBilling] = useState(false);
  const navigate = useNavigate();

  const getCustomer = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await apis.fetchCustomerDetails({ id });
      setCustomer(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log(error);
      // setError(error.message);
    }
    setLoading(false);
  }, []);

  const getMenuByShop = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await apis.getMenuByShop(id);
      setMenu(res.data.menu);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log(error);
      // setError(error.message);
    }
    setLoading(false);
  }, []);

  const handlePrintTicket = async (orderDetails: {
    orderNumber: string;
    items: Array<{ itemName: string; quantity: number }>;
  }) => {
    console.log(shopState.data);
    try {
      const kitchenPrinter = await posXDB.printers
        .where('printerLocation')
        .equals('kitchen')
        .toArray();
      if (shopState.data && orderDetails && kitchenPrinter.length) {
        const payload: IPrintTicketRequest = {
          interface: kitchenPrinter[0].printerValue,
          shopName: shopState.data.shopName,
          orderNumber: orderDetails.orderNumber,
          orderItems:
            orderDetails.items?.map((item) => ({
              itemName: item.itemName,
              quantity: item.quantity,
            })) || [],
        };
        await apis.printTicket(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNewOrder = useCallback(async () => {
    if (!shopId) {
      return;
    }
    setLoading(true);
    try {
      const menuItems = menu.flatMap((category) => category.menuItems);
      const selectedItems = menuItems
        .filter((item) => ticketItems[item.id])
        .map((item) => ({
          itemId: item.id,
          itemName: item.itemName,
          price: item.price,
          quantity: ticketItems[item.id],
        }));
      console.log(selectedItems);
      const payload = {
        shopId,
        customerId,
        employeeId: authState.data?.id,
        items: selectedItems,
      };
      let res: IOrderResponse;
      if (orderId) {
        res = (
          await apis.createNewOrderItems(orderId, { items: selectedItems })
        ).data;
        await getOrderDetails(orderId);
      } else {
        res = (await apis.createOrder(payload)).data;
        setSearchParams({ orderId: res.id });
      }
      await handlePrintTicket({
        orderNumber: res.orderNumber,
        items:
          selectedItems?.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
          })) || [],
      });
      setTicketItems({});
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.length, Object.keys(ticketItems).length, orderId]);

  const getOrderDetails = useCallback(async (orderId: string) => {
    try {
      const orderDetailsResponse = await apis.getOrderById(orderId);
      if (orderDetailsResponse.data.isClosed) {
        navigate(-2);
      }
      setOrderDetails(orderDetailsResponse.data);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const onMenuItemClick = (id: string, counter = 1) => {
    if (ticketItems[id] + counter === 0) {
      const items = { ...ticketItems };
      delete items[id];
      setTicketItems(items);
      return;
    }
    const updatedItems = {
      ...ticketItems,
      [id]: ticketItems[id] ? ticketItems[id] + counter : 1,
    };

    setTicketItems(updatedItems);
  };

  const handleItemReject = async () => {
    if (!itemToDelete && !rejectionReason) {
      return;
    }
    try {
      const payload: IOrderItemUpdateRequest = {
        id: itemToDelete,
        rejectionReason,
      };
      await apis.updateOrderItem(payload);
      if (orderId) {
        await getOrderDetails(orderId);
      }

      setRejectionReason('');
      setItemToDelete('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateBillClick = async (payload: IBillingFormPayload) => {
    const employee = authState.data;
    const shopDetails = shopState.data;
    try {
      if (customer && orderDetails && employee && shopDetails) {
        const billPayload: ICreateBillRequest = {
          amount: payload.totalPrice || 0,
          customerId: customer.id,
          employeeId: employee.id,
          gst: payload.gst,
          discount: payload.discount,
          orderId: orderDetails.id,
          serviceCharges: payload.serviceCharges,
          shopId: orderDetails.shopId,
        };
        const billResponse = await apis.createBill(billPayload);
        await apis.capturePayment({
          amountRecieved: billResponse.data.totalAmount,
          billId: billResponse.data.id,
          paymentMode: payload.paymentMode,
        });

        const billingPrinter = await posXDB.printers
          .where('printerLocation')
          .equals('billing')
          .toArray();
        if (billingPrinter.length) {
          await apis.printBill({
            interface: billingPrinter[0].printerValue,
            amount: billResponse.data.amount,
            customerName: customer.name,
            employeeName: employee.firstName + ' ' + employee.lastName,
            orderId: orderDetails.id,
            orderNumber: orderDetails.orderNumber,
            grandTotal: billResponse.data.totalAmount,
            roundOff: billResponse.data.roundoffDiff,
            shopAddress: shopDetails.address,
            shopContact: shopDetails.contactNo,
            orderItems: orderDetails.items || [],
            shopName: shopDetails.shopName,
            date: orderDetails.createdAt,
            totalQty:
              orderDetails.items?.reduce(
                (acc, curr) => acc + curr.quantity,
                0,
              ) || 0,
            gst: {
              gstNumber: shopDetails.registrationNo,
              amount: payload.gst,
              percentage: payload.gst ? '5' : '0',
            },
          });
        }
        await getOrderDetails(orderDetails.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (orderId) getOrderDetails(orderId);
  }, [orderId, getOrderDetails]);

  useEffect(() => {
    if (shopId) getMenuByShop(shopId);
    if (customerId) getCustomer(customerId);
  }, [customerId, getCustomer, shopId, getMenuByShop]);

  return (
    <div className="max-h-full flex flex-col flex-grow">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {orderId ? `Update Order` : 'New Order'}
        </h1>
        <div className="flex items-center space-x-2">
          {orderDetails && (
            <>
              <Badge variant="outline" className="space-x-1">
                <span className="font-bold">OrderId:</span>
                <span className="font-light">{orderDetails.id}</span>
              </Badge>
              <Badge variant="outline" className="space-x-1">
                <span className="font-bold">Order Number:</span>
                <span className="font-light">{orderDetails.orderNumber}</span>
              </Badge>
            </>
          )}
          {customer && (
            <Badge variant="outline" className="space-x-1">
              <span className="font-bold">Customer:</span>
              <span className="font-light">{customer.name}</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex-1 grid grid-flow-col grid-cols-12 space-x-4">
          <div className="col-span-8 2xl:col-span-9">
            {menu.length && <Menu data={menu} onItemSelect={onMenuItemClick} />}
          </div>
          <div className="col-span-4 2xl:col-span-3">
            <OrderSummary
              shopDetails={shopState.data}
              onQtyChange={onMenuItemClick}
              menuItems={menu.flatMap((category) => category.menuItems)}
              ticketItems={ticketItems}
              onCreateNewOrder={handleCreateNewOrder}
              onPrintTicket={handlePrintTicket}
              orderDetails={orderDetails}
              onItemDelete={handleItemDeleteClick}
              onBillingClick={() => setOpenBilling(true)}
            />
          </div>
        </div>
      </div>
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(value) => setItemToDelete(value ? itemToDelete : '')}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the item from
              order.
            </AlertDialogDescription>
            <Select onValueChange={setRejectionReason} value={rejectionReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason to delete" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reasons</SelectLabel>
                  <SelectItem value="customerCancelled">
                    Customer cancelled
                  </SelectItem>
                  <SelectItem value="unservable">
                    Unable to serve right now
                  </SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant={'secondary'}
              onClick={() => {
                setItemToDelete('');
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button disabled={!rejectionReason} onClick={handleItemReject}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BillingForm
        open={openBilling}
        onOpenChange={setOpenBilling}
        orderDetails={orderDetails}
        customer={customer}
        onFormSubmit={handleGenerateBillClick}
      />
    </div>
  );
}
