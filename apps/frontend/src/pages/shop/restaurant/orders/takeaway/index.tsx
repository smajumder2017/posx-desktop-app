import { Button } from '@/components/custom/button';
import OrderList from '../components/orders-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { IOrderResponse } from '@/models/order';
import * as apis from '@/apis';
import OrderDetails from '../components/order-details';
import { useAppSelector } from '@/hooks/redux';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Paginate } from '@/components/custom/paginate';

export default function Takeaway() {
  const [contactNo, setContactNo] = useState('');
  const [customerSelector, setCustomerSelector] = useState(false);
  const { shopId } = useParams<{
    shopId: string;
  }>();
  const [tab, setTab] = useState('pastorders');
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const authState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  // const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0');
  const itemsPerPage = 10;

  const fetchOrders = useCallback(
    async (args: {
      shopId: string;
      orderStatusId?: number;
      employeeId?: string;
      isClosed: boolean;
      skip?: number;
      take?: number;
    }) => {
      try {
        const orderRes = await apis.getAllOrder({
          shopId: args.shopId,
          orderStatusId: args.orderStatusId,
          isClosed: args.isClosed,
          employeeId: args.employeeId,
          skip: args.skip || 0,
          take: args.take || itemsPerPage,
        });
        console.log(orderRes.data);
        setTotalCount(orderRes.data.count);
        setOrders(orderRes.data.orders);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  useEffect(() => {
    if (shopId) {
      const skip = itemsPerPage * page;
      if (tab === 'ongoingorders') {
        fetchOrders({
          shopId,
          orderStatusId: 1,
          isClosed: false,
          skip,
          take: itemsPerPage,
        });
        return;
      }
      fetchOrders({
        shopId,
        isClosed: true,
        employeeId: authState.data?.id,
        skip,
        take: itemsPerPage,
      });
    }
  }, [shopId, fetchOrders, tab, authState.data, page]);

  const hanldeCustomerSelect = (contactNo: string, customer?: ICustomer) => {
    if (customer) {
      navigate(customer.id);
      return;
    }
    setContactNo(contactNo);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    setSearchParams((prev) => {
      prev.delete('page');
      return prev;
    });
  };

  const handlePageChange = (page: number) => {
    console.log(page);

    setSearchParams({ ...searchParams, page: page.toString() });
  };
  return (
    <>
      {/* ===== Main ===== */}

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
        onValueChange={handleTabChange}
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
        <TabsContent value="pastorders" className="flex gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  (Showing {orders.length}/{totalCount}) Recent orders from your
                  store.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <OrderList
                  orders={orders}
                  onOrderSelect={setSelectedOrder}
                  selectedOrder={selectedOrder}
                />
              </CardContent>
            </Card>
            {orders.length ? (
              <Paginate
                totalCount={totalCount}
                maxPages={5}
                itemsPerPage={itemsPerPage}
                value={page}
                onChange={handlePageChange}
              />
            ) : null}
          </div>

          {selectedOrder && (
            <div>
              <OrderDetails
                orderId={selectedOrder}
                onClose={() => setSelectedOrder('')}
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="ongoingorders" className="space-y-4">
          <div className="flex flex-col flex-1 gap-4">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Running Orders</CardTitle>
                <CardDescription>
                  Ongoing orders from your store.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {orders.length ? <OrderList orders={orders} /> : null}
              </CardContent>
            </Card>
            {orders.length ? (
              <Paginate
                totalCount={totalCount}
                maxPages={5}
                itemsPerPage={itemsPerPage}
                value={page}
                onChange={handlePageChange}
              />
            ) : null}
          </div>
          {/* <OrderList orders={orders} /> */}
        </TabsContent>
      </Tabs>
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
