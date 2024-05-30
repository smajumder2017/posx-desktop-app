import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItemsEntity } from '@/models/menu';
import { IOrderResponse } from '@/models/order';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatPrice } from '@/utils/currency';
import * as apis from '@/apis';
import {
  AlertDialog,
  AlertDialogCancel,
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
import { useNavigate } from 'react-router-dom';
import { IShopResponse } from '@/models/shop';
import { IBillResponse } from '@/models/billing';

interface IOrderSummary {
  ticketItems: { [key: string]: number };
  menuItems: MenuItemsEntity[];
  orderDetails?: IOrderResponse;
  shopDetails?: IShopResponse | null;
  bill?: IBillResponse;
  onSettelClick?: () => void;
  onQtyChange: (id: string, counter?: number) => void;
  onCreateNewOrder: () => Promise<void>;
  onPrintTicket: (orderDetails: {
    orderNumber: string;
    items: Array<{ itemName: string; quantity: number }>;
  }) => Promise<void>;
  onItemDelete: (itemId: string) => void;
  onBillingClick: () => void;
}
const OrderSummary: React.FC<IOrderSummary> = ({
  ticketItems,
  menuItems,
  bill,
  onQtyChange,
  orderDetails,
  onCreateNewOrder,
  shopDetails,
  onPrintTicket,
  onItemDelete,
  onBillingClick,
  onSettelClick,
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(
    !orderDetails ? 'ticket-items' : 'order-items',
  );
  const [cancelAlert, setCancelAlert] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    setTab(!orderDetails ? 'ticket-items' : 'order-items');
  }, [orderDetails]);

  const selectedItems = menuItems
    .filter((item) => ticketItems[item.id])
    .map((item) => ({ ...item, quantity: ticketItems[item.id] }));

  const totalPrice = orderDetails?.items?.reduce((acc, curr) => {
    acc += curr.price * curr.quantity;
    return acc;
  }, 0);

  const handleCancelOrder = async () => {
    if (!orderDetails) {
      return;
    }
    try {
      await apis.updateOrder({
        id: orderDetails.id,
        orderStatusId: 3,
        cancellationReason,
        isClosed: true,
      });
      setCancellationReason('');
      setCancelAlert(false);
      navigate(`/${shopDetails?.id}/takeaway`);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrintTicket = async () => {
    if (!orderDetails) {
      return;
    }
    try {
      const payload = {
        orderNumber: orderDetails.orderNumber,
        items:
          orderDetails.items?.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
          })) || [],
      };
      await onPrintTicket(payload);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* <CardHeader className="flex flex-row items-start bg-muted/50">
        
      </CardHeader> */}
      <CardContent className="p-6 text-sm flex-1">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="ticket-items" className="w-full">
              Order Items
            </TabsTrigger>
            <TabsTrigger
              value="order-items"
              className="w-full"
              disabled={!orderDetails}
            >
              Order Summary
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ticket-items">
            <ScrollArea style={{ height: 'calc(100vh - 320px)' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">Item</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selectedItems.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="hidden sm:table-cell">
                          {item.itemName}
                        </TableCell>
                        <TableCell className="text-center flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            className="w-6 h-6 p-1"
                            onClick={() => onQtyChange(item.id, -1)}
                          >
                            -
                          </Button>

                          {item.quantity}

                          <Button
                            variant="outline"
                            className="w-6 h-6 p-1"
                            onClick={() => onQtyChange(item.id)}
                          >
                            +
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity * item.price}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="order-items">
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell"></TableHead>
                    <TableHead className="text-left">Item</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderDetails?.items?.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Button
                            variant="outline"
                            className="w-6 h-6 p-1"
                            onClick={() => onItemDelete(item.id)}
                          >
                            <FaTrash size={'10px'} />
                          </Button>
                        </TableCell>

                        <TableCell className="text-left">
                          {item.itemName}
                        </TableCell>
                        <TableCell className="text-center flex items-center justify-center gap-2">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.quantity * item.price)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">
                      {orderDetails?.items?.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(totalPrice || 0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        {/* <Separator className="my-4" />

        <Separator className="my-4" />

        <Separator className="my-4" /> */}
      </CardContent>
      <CardFooter className="flex flex-row flex-wrap items-center border-t px-6 py-3 gap-2">
        {tab === 'ticket-items' && (
          <Button
            className="flex-1"
            onClick={() => {
              onCreateNewOrder();
            }}
          >
            Place Order
          </Button>
        )}
        {tab === 'order-items' && (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant={'outline'}
              className="col-span-1"
              onClick={handlePrintTicket}
            >
              Print Ticket
            </Button>
            <Button className="col-span-1" onClick={onBillingClick}>
              Generate Bill
            </Button>
            {bill && !bill.isSetteled && (
              <Button
                variant={'outline'}
                className="col-span-1"
                onClick={onSettelClick}
              >
                Settel Order
              </Button>
            )}
            <Button
              variant={'secondary'}
              className={!bill ? 'col-span-2' : 'col-span-1'}
              onClick={() => setCancelAlert(true)}
            >
              Cancel Order
            </Button>
          </div>
        )}
        {/* <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div> */}
        {/* <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </CardFooter>
      <AlertDialog open={cancelAlert} onOpenChange={setCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cancel the order.
            </AlertDialogDescription>
            <Select
              onValueChange={setCancellationReason}
              value={cancellationReason}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a cancellation reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reasons</SelectLabel>
                  <SelectItem value="cancelledByCustomer">
                    Customer cancelled the order
                  </SelectItem>
                  <SelectItem value="unservable">
                    Unable to serve right now
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button disabled={!cancellationReason} onClick={handleCancelOrder}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default OrderSummary;
