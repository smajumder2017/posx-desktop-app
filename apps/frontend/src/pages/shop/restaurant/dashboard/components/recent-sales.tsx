import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IOrderResponse } from '@/models/order';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as apis from '@/apis';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
// import { formatPrice } from '@/utils/currency';

export function RecentSales() {
  const { shopId } = useParams<{
    shopId: string;
  }>();

  const [orders, setOrders] = useState<IOrderResponse[]>([]);
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
          // employeeId: args.employeeId,
          skip: 0,
          take: 5,
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
      fetchOrders({ shopId, isClosed: true, orderStatusId: 2 });
    }
  }, [shopId, fetchOrders]);

  return (
    <div className="space-y-8">
      {orders.map((order) => {
        const lname = order?.customer?.name.split(' ')?.[1];
        const initials = `${order?.customer?.name[0].toUpperCase()}${
          lname?.[0]?.toUpperCase() || ''
        }`;
        return (
          <div className="flex items-center" key={order.id}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {order.customer?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatPhoneNumberIntl(order.customer?.contactNo || '')}
              </p>
            </div>
            {/* <div className="ml-auto font-medium">{formatPrice(order.)}</div> */}
          </div>
        );
      })}
    </div>
  );
}
