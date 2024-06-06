import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { IOrderResponse } from '@/models/order';
import { IShopResponse } from '@/models/shop';
import { formatPrice } from '@/utils/currency';

interface IBillDisplayProps {
  shopDetails?: IShopResponse | null;
  orderDetails?: IOrderResponse;
  amount?: number;
  discount?: number;
  gst?: number;
  serviceChargeAmnt?: number;
  packingChargeAmount?: number;
  roundoffDiff?: number;
  paid?: number;
  final?: number;
}

export const BillDisplay: React.FC<IBillDisplayProps> = ({
  orderDetails,
  amount,
  discount,
  gst,
  serviceChargeAmnt,
  packingChargeAmount,
  paid,
  roundoffDiff,
  final,
}) => {
  return (
    <div className="mt-2">
      <ScrollArea style={{ maxHeight: 'calc(100svh - 320px)' }}>
        <Table
          className="text-xs"
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
                    {item.quantity * item.price}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell className="text-center">
                {orderDetails?.items?.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0,
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                {formatPrice(amount || 0)}
              </TableCell>
            </TableRow>
            {discount ? (
              <TableRow className="font-normal border-t border-dashed">
                <TableCell>Discount</TableCell>
                <TableCell className="text-center">
                  {/* {orderDetails?.items?.reduce(
              (acc, curr) => acc + curr.quantity,
              0,
            )} */}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  -{formatPrice(discount)}
                </TableCell>
              </TableRow>
            ) : null}
            {gst ? (
              <TableRow className="font-normal">
                <TableCell>GST</TableCell>
                <TableCell className="text-center">5%</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{formatPrice(gst)}</TableCell>
              </TableRow>
            ) : null}
            {serviceChargeAmnt ? (
              <TableRow className="font-normal">
                <TableCell>Service charges</TableCell>
                <TableCell className="text-center">7%</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatPrice(serviceChargeAmnt)}
                </TableCell>
              </TableRow>
            ) : null}
            {packingChargeAmount ? (
              <TableRow className="font-normal">
                <TableCell>Packing charges</TableCell>
                <TableCell className="text-center">
                  {/* {orderDetails?.items?.reduce(
              (acc, curr) => acc + curr.quantity,
              0,
            )} */}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatPrice(packingChargeAmount || 0)}
                </TableCell>
              </TableRow>
            ) : null}
            {roundoffDiff ? (
              <TableRow className="font-normal">
                <TableCell>Roundoff</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-right">
                  {formatPrice(roundoffDiff)}
                </TableCell>
              </TableRow>
            ) : null}
            {paid ? (
              <TableRow className="font-normal border-t">
                <TableCell>Paid</TableCell>
                <TableCell className="text-center">
                  {/* {orderDetails?.items?.reduce(
              (acc, curr) => acc + curr.quantity,
              0,
            )} */}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatPrice(paid || 0)}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow className="border-t">
              <TableCell>Final</TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                {formatPrice(final || 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
};
