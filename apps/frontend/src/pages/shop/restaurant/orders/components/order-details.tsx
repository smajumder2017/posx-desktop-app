// import {
//   ChevronLeft,
//   ChevronRight,
//   Copy,
//   CreditCard,
//   MoreVertical,
//   Truck,
// } from "lucide-react"

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IOrderResponse } from '@/models/order';
import React, { useCallback, useEffect, useState } from 'react';
import * as apis from '@/apis';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { formatPrice } from '@/utils/currency';
import { IBillResponse } from '@/models/billing';
import { prettyDateTime } from '@/utils/date';
import { MdClose } from 'react-icons/md';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { posXDB } from '@/db/db';
import { IconPrinter } from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

interface IOrderDetailsProps {
  syncedOrders?: boolean;
  orderId: string;
  onClose?: () => void;
}

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50 gap-4">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-md">
            <Skeleton className="h-4 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Skeleton className="h-4 w-8" />
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Order Details</div>
          <Table
            className="text-xs 2xl:text-sm"
            // containerClassName="border border-dashed rounded-lg"
          >
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Item</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {new Array(4).fill('').map((_, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
              </TableRow>

              <TableRow className="font-normal border-t border-dashed">
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>{' '}
                <TableCell>
                  <Skeleton className="h-4" />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3 text-xs 2xl:text-sm">
              <Skeleton className="h-4 w-[250px]" />
            </dl>
          </div>
        </>

        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

const OrderDetails: React.FC<IOrderDetailsProps> = ({
  orderId,
  onClose,
  syncedOrders,
}) => {
  const [orderDetails, setOrderDetails] = useState<IOrderResponse>();
  const [billDetails, setBillDetails] = useState<IBillResponse>();
  const [loader, setLoader] = useState(false);

  const getOrderDetails = useCallback(async (orderId: string) => {
    setLoader(true);
    try {
      const orderDetailsResponse = syncedOrders
        ? await apis.getSyncedOrderById(orderId)
        : await apis.getOrderById(orderId);
      setOrderDetails(orderDetailsResponse.data);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBillDetails = useCallback(async (orderId: string) => {
    setLoader(true);
    try {
      const orderDetailsResponse = syncedOrders
        ? await apis.getSyncedActiveBill(orderId)
        : await apis.getActiveBill(orderId);
      setBillDetails(orderDetailsResponse.data);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
      getBillDetails(orderId);
    }
  }, [orderId, getOrderDetails, getBillDetails]);

  const onPrintBillClick = async () => {
    if (orderDetails && billDetails && billDetails.customer) {
      const billingPrinter = await posXDB.printers
        .where('printerLocation')
        .equals('billing')
        .toArray();
      if (billingPrinter.length) {
        await apis.printBill({
          interface: billingPrinter[0].printerValue,
          amount: billDetails.amount,
          customerName: billDetails.customer.name,
          employeeName:
            billDetails.employee?.firstName +
            ' ' +
            billDetails.employee?.lastName,
          orderId: orderDetails.id,
          discount: billDetails.discount
            ? { percentage: '0', amount: billDetails.discount }
            : undefined,
          orderNumber: orderDetails.orderNumber,
          grandTotal: billDetails.totalAmount,
          roundOff: billDetails.roundoffDiff,
          shopAddress: billDetails.shop?.address || '',
          shopContact: billDetails.shop?.contactNo || '',
          orderItems: orderDetails.items || [],
          shopName: billDetails.shop?.shopName || '',
          date: orderDetails.createdAt,
          totalQty:
            orderDetails.items?.reduce((acc, curr) => acc + curr.quantity, 0) ||
            0,
          gst: billDetails.shop?.gstinNo
            ? {
                gstNumber: billDetails.shop.gstinNo,
                amount: billDetails.gst,
                percentage: billDetails.gst
                  ? (
                      (billDetails.shop?.cgstPercentage || 0) +
                      (billDetails.shop?.sgstPercentage || 0)
                    ).toString()
                  : '0',
              }
            : undefined,
        });
      }
    }
  };

  if (loader) {
    return <SkeletonCard />;
  }

  if (orderDetails)
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50 gap-4">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-md">
              {orderId}
              {/* <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button> */}
            </CardTitle>
            <CardDescription>
              Date: {prettyDateTime(new Date(orderDetails.createdAt))}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {billDetails && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={onPrintBillClick}
              >
                <IconPrinter className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Print bill
                </span>
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={onClose}
            >
              <MdClose className="h-3.5 w-3.5" />
              <span className="sr-only">Close</span>
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Order Details</div>
            <Table
              className="text-xs 2xl:text-sm"
              containerClassName="border border-dashed rounded-lg"
            >
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orderDetails?.items?.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-center flex items-center justify-center gap-2">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.quantity * item.price)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Sub total</TableCell>
                  <TableCell className="text-center">
                    {orderDetails?.items?.reduce(
                      (acc, curr) => acc + curr.quantity,
                      0,
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">
                    {formatPrice(billDetails?.amount || 0)}
                  </TableCell>
                </TableRow>
                {billDetails?.discount ? (
                  <TableRow className="font-normal border-t border-dashed">
                    <TableCell>Discount</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center"></TableCell>
                    <TableCell className="text-right">
                      {formatPrice(billDetails.discount || 0)}
                    </TableCell>
                  </TableRow>
                ) : null}
                {billDetails?.gst ? (
                  <TableRow className="font-normal">
                    <TableCell>GST</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center">5%</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(billDetails.gst)}
                    </TableCell>
                  </TableRow>
                ) : null}
                {billDetails?.serviceCharges ? (
                  <TableRow className="font-normal">
                    <TableCell>Service charges</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center">7%</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(billDetails.serviceCharges)}
                    </TableCell>
                  </TableRow>
                ) : null}
                {billDetails?.roundoffDiff ? (
                  <TableRow className="font-normal">
                    <TableCell>Roundoff</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center"></TableCell>
                    <TableCell className="text-right">
                      {formatPrice(billDetails.roundoffDiff)}
                    </TableCell>
                  </TableRow>
                ) : null}
                {/* {packingCharge ? (
                      <TableRow className="font-normal">
                        <TableCell>Packing charges</TableCell>
                        <TableCell className="text-center">
                          {orderDetails?.items?.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0,
                      )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(0)}
                        </TableCell>
                      </TableRow>
                    ) : null} */}
                <TableRow className="border-t">
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-right">
                    {formatPrice(billDetails?.totalAmount || 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          {/* <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>Liam Johnson</span>
                <span>1234 Main St.</span>
                <span>Anytown, CA 12345</span>
              </address>
            </div>
            <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div>
          </div> */}

          {orderDetails?.customer && (
            <>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3 text-xs 2xl:text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>{orderDetails.customer.name}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">
                        {formatPhoneNumberIntl(orderDetails.customer.contactNo)}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          )}
          {billDetails?.payments?.length ? (
            <Separator className="my-4" />
          ) : null}
          {billDetails?.payments?.length && (
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3 text-xs 2xl:text-sm">
                {billDetails?.payments?.map((payment) => {
                  return (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between"
                    >
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        {payment.paymentMode}
                      </dt>
                      <dd>{formatPrice(payment.amountRecieved)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{' '}
            <time
              dateTime={new Date(orderDetails.updatedAt).toLocaleDateString()}
            >
              {prettyDateTime(new Date(orderDetails.updatedAt))}
            </time>
          </div>
        </CardFooter>
      </Card>
    );

  return null;
};

export default OrderDetails;
