import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IOrderResponse } from '@/models/order';
import { prettyDateTime } from '@/utils/date';
import { Link } from 'react-router-dom';

interface IOrderProps {
  orders: IOrderResponse[];
  onOrderSelect?: (orderId: string) => void;
  selectedOrder?: string;
}

const SelectedOrderItems: React.FC<IOrderProps> = ({
  orders,
  onOrderSelect,
  selectedOrder,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead className="hidden sm:table-cell text-center">
            Order Number
          </TableHead>
          <TableHead className="hidden sm:table-cell">Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden sm:table-cell">Order taken by</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          return (
            <TableRow
              key={order.id}
              className={`text-xs 2xl:text-sm ${
                selectedOrder === order.id ? 'bg-accent' : ''
              }`}
            >
              <TableCell className="font-medium">
                {order.orderStatus?.value === 'CREATED' && order.customerId ? (
                  <Link to={`${order.customerId}?orderId=${order.id}`}>
                    {order.id}
                  </Link>
                ) : (
                  <div
                    className="cursor-pointer w-full h-full"
                    onClick={() => onOrderSelect?.(order.id)}
                  >
                    {order.id}
                  </div>
                )}

                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-center">
                {order.orderNumber}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="font-medium">{order.customer?.name}</div>
                <div className="hidden text-muted-foreground md:inline">
                  {order.customer?.contactNo}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary">{order.orderStatus?.value}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {`${order.employee?.firstName} ${order.employee?.lastName}`}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {prettyDateTime(new Date(order.createdAt))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SelectedOrderItems;
