import { Button } from '@/components/custom/button';
import OrderList from '../components/orders-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutBody } from '@/components/custom/layout';
import {
  DialogHeader,
  // DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CustomerSelector from '../components/customer-selector';
import CustomerForm from '../components/customer-form';
import { ICustomer } from '@/models/customer';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { IOrderResponse } from '@/models/order';
import * as apis from '@/apis';
// import { RecentSales } from './components/recent-sales';
// import { Overview } from './components/overview';

export default function Takeaway() {
  const [contactNo, setContactNo] = useState('');
  const [customerSelector, setCustomerSelector] = useState(false);
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const [tab, setTab] = useState('pastorders');
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const navigate = useNavigate();

  const fetchOrders = useCallback(
    async (args: {
      shopId: string;
      orderStatusId?: number;
      isClosed: boolean;
    }) => {
      try {
        const orderRes = await apis.getAllOrder({
          shopId: args.shopId,
          orderStatusId: args.orderStatusId,
          isClosed: args.isClosed,
          skip: 0,
          take: 100,
        });
        console.log(orderRes.data);
        setOrders(orderRes.data.orders);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  useEffect(() => {
    if (shopId) {
      if (tab === 'ongoingorders') {
        fetchOrders({ shopId, orderStatusId: 1, isClosed: false });
        return;
      }
      fetchOrders({ shopId, isClosed: true });
    }
  }, [shopId, fetchOrders, tab]);

  const hanldeCustomerSelect = (contactNo: string, customer?: ICustomer) => {
    if (customer) {
      navigate(customer.id);
      return;
    }
    setContactNo(contactNo);
  };

  return (
    <>
      {/* ===== Main ===== */}
      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Takeaway
          </h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setCustomerSelector(true)}>New Order</Button>
          </div>
        </div>
        <Tabs
          orientation="vertical"
          value={tab}
          onValueChange={(value) => setTab(value)}
          className="space-y-4"
        >
          <div className="w-full pb-2">
            <TabsList>
              <TabsTrigger value="pastorders">Past Orders</TabsTrigger>
              <TabsTrigger value="ongoingorders">Ongoing Orders</TabsTrigger>
              {/* <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value="pastorders" className="space-y-4">
            <OrderList orders={orders} />
          </TabsContent>
          <TabsContent value="ongoingorders" className="space-y-4">
            <OrderList orders={orders} />
          </TabsContent>
        </Tabs>
      </LayoutBody>
      <Dialog
        open={customerSelector}
        onOpenChange={(value) => {
          setCustomerSelector(value);
          setContactNo('');
        }}
      >
        <DialogContent className="sm:max-w-[425px] z-index-999">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Enter customer phone number to get the deatils.
            </DialogDescription>
          </DialogHeader>
          {contactNo ? (
            <CustomerForm
              contactNo={contactNo}
              onSuccess={hanldeCustomerSelect}
            />
          ) : (
            <CustomerSelector onCustomerSelect={hanldeCustomerSelect} />
          )}

          {/* <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
