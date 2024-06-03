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
import { IBillResponse, ICreateBillRequest } from '@/models/billing';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/currency';
import { useToast } from '@/components/ui/use-toast';

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
  const [bill, setBill] = useState<IBillResponse>();
  const [openBilling, setOpenBilling] = useState(false);
  const [openSettel, setOpenSettel] = useState(false);
  const [partialPayment, setPartialPayment] = useState(false);
  const [paid, setPaid] = useState<number | undefined>();
  const [paymentMode, setPaymentMode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const ticketLength = Object.keys(ticketItems).reduce((acc, curr) => {
    return acc + ticketItems[curr];
  }, 0);

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
    try {
      const kitchenPrinter = await posXDB.printers
        .where('printerLocation')
        .equals('kitchen')
        .toArray();
      if (shopState.data && orderDetails && kitchenPrinter.length) {
        kitchenPrinter.forEach(async (printer) => {
          const payload: IPrintTicketRequest = {
            interface: printer.printerValue,
            shopName: shopState.data?.shopName || '',
            orderNumber: orderDetails.orderNumber,
            orderItems:
              orderDetails.items?.map((item) => ({
                itemName: item.itemName,
                quantity: item.quantity,
              })) || [],
          };
          await apis.printTicket(payload);
          toast({
            title: 'Print Successful',
            description:
              'KOT Printed for order number ' + orderDetails.orderNumber,
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNewOrder = useCallback(async () => {
    if (!shopId) {
      return;
    }
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
      toast({
        title: 'Order placed',
        description: 'Order placed with order number ' + res.orderNumber,
      });
      await handlePrintTicket({
        orderNumber: res.orderNumber,
        items:
          selectedItems?.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
          })) || [],
      });
      setTicketItems({});
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.length, ticketLength, orderId]);

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

  const getBillDetails = useCallback(async (orderId: string) => {
    try {
      const billResponse = await apis.getActiveBill(orderId);
      setBill(billResponse.data);
    } catch (error) {
      console.log(error);
    }
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
          discount: payload.discount || 0,
          orderId: orderDetails.id,
          serviceCharges: payload.serviceCharges,
          shopId: orderDetails.shopId,
        };
        const billResponse = await apis.createBill(billPayload);
        if (payload.paymentMode) {
          await apis.capturePayment({
            amountRecieved: payload.paid || billResponse.data.totalAmount,
            billId: billResponse.data.id,
            paymentMode: payload.paymentMode,
          });
        }

        const billingPrinter = await posXDB.printers
          .where('printerLocation')
          .equals('billing')
          .toArray();
        if (billingPrinter.length) {
          await apis.printBill({
            interface: billingPrinter[0].printerValue,
            amount: billResponse.data.amount,
            discount: billResponse.data.discount
              ? { percentage: '0', amount: billResponse.data.discount }
              : undefined,
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
            gst: shopDetails.gstinNo
              ? {
                  gstNumber: shopDetails.gstinNo,
                  amount: payload.gst,
                  percentage: payload.gst
                    ? (
                        (shopDetails?.cgstPercentage || 0) +
                        (shopDetails?.sgstPercentage || 0)
                      ).toString()
                    : '0',
                }
              : undefined,
          });
        }
        setOpenBilling(false);
        await getOrderDetails(orderDetails.id);
        await getBillDetails(orderDetails.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettelClick = async () => {
    if (bill && orderDetails) {
      await apis.capturePayment({
        amountRecieved: paid || pendingAmount,
        billId: bill.id,
        paymentMode: paymentMode,
      });
      await getOrderDetails(orderDetails.id);
      await getBillDetails(orderDetails.id);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
      getBillDetails(orderId);
    }
  }, [orderId, getOrderDetails, getBillDetails]);

  useEffect(() => {
    if (shopId) getMenuByShop(shopId);
    if (customerId) getCustomer(customerId);
  }, [customerId, getCustomer, shopId, getMenuByShop]);

  const totalBillAmount = bill?.totalAmount || 0;
  const paidAmount =
    bill?.payments?.reduce((acc, curr) => {
      return acc + curr.amountRecieved;
    }, 0) || 0;
  const pendingAmount = totalBillAmount - paidAmount;

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
              bill={bill}
              onSettelClick={() => setOpenSettel(true)}
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
        shopDetails={shopState.data}
        orderDetails={orderDetails}
        customer={customer}
        onFormSubmit={handleGenerateBillClick}
      />
      <AlertDialog open={openSettel} onOpenChange={setOpenSettel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Settel Pending Amount</AlertDialogTitle>
            <AlertDialogDescription>
              Setteling the amount will close the order
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-0.5 col-span-1">
            <Label>Payment method</Label>
            <Select onValueChange={setPaymentMode} value={paymentMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment methods</SelectLabel>
                  <SelectItem value="CreditCard">Credit Card</SelectItem>
                  <SelectItem value="DebitCard">Debit Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-1">
            <div className="space-y-0.5">
              <Label>Partial payment</Label>
              <div className="text-sm font-light">
                Check this to capture partial payment
              </div>
            </div>

            <Switch
              checked={partialPayment}
              onCheckedChange={setPartialPayment}
            />
          </div>
          <div className="space-y-0.5 col-span-1">
            <Label htmlFor="offerCode" className="text-right">
              Payment amount
            </Label>
            <Input
              disabled={!partialPayment}
              placeholder="Enter payment amount"
              type="number"
              value={paid || ''}
              onChange={(e) => {
                setPaid(parseInt(e.target.value || '0'));
              }}
            />
          </div>
          <AlertDialogFooter>
            <Button
              variant={'secondary'}
              onClick={() => {
                setOpenSettel(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSettelClick} disabled={!paymentMode}>
              Settel {formatPrice(paid || pendingAmount)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
