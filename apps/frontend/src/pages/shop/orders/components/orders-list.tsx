import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IOrderResponse } from '@/models/order';
import { Link } from 'react-router-dom';

interface IOrderProps {
  orders: IOrderResponse[];
}

const SelectedOrderItems: React.FC<IOrderProps> = ({ orders }) => {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead className="hidden sm:table-cell">
                Order Number
              </TableHead>
              <TableHead className="hidden sm:table-cell">Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Order taken by
              </TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">
                      <Link
                        to={
                          order.orderStatus?.value === 'CREATED' &&
                          order.customerId
                            ? `${order.customerId}?orderId=${order.id}`
                            : '#'
                        }
                      >
                        {order.id}
                      </Link>
                    </div>
                    {/* <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div> */}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-medium">{order.customer?.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.customer?.contactNo}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="secondary">
                      {order.orderStatus?.value}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {`${order.employee?.firstName} ${order.employee?.lastName}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SelectedOrderItems;
