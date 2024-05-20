import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
import { IOrderResponse } from '@/models/order';
import { ICustomer } from '@/models/customer';
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
import { formatPrice } from '@/utils/currency';
import { useState } from 'react';

export interface IBillingFormPayload {
  totalPrice: number;
  gst: number;
  discount: number;
  serviceCharges: number;
  paymentMode: string;
}
interface IBillingFormProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  orderDetails?: IOrderResponse;
  customer?: ICustomer;
  onFormSubmit: (payload: IBillingFormPayload) => Promise<void>;
}

const BillingForm: React.FC<IBillingFormProps> = ({
  open,
  onOpenChange,
  orderDetails,
  // customer,
  onFormSubmit,
}) => {
  const [paymentMode, setPaymentMode] = useState('');
  const [serviceCharge, setServiceCharge] = useState(false);
  const [gstCharge, setGstCharge] = useState(true);
  const [packingCharge, setPackingCharge] = useState(false);
  const [discount] = useState(0);
  const totalPrice = orderDetails?.items?.reduce((acc, curr) => {
    return acc + curr.quantity * curr.price;
  }, 0);

  const gst = gstCharge && totalPrice ? (totalPrice * 5) / 100 : 0;
  const serviceChargeAmnt =
    serviceCharge && totalPrice ? (totalPrice * 7) / 100 : 0;

  const handleGenerateBillClick = async () => {
    onFormSubmit({
      totalPrice: totalPrice || 0,
      gst,
      serviceCharges: serviceChargeAmnt,
      discount,
      paymentMode,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>
            Billing (Order Number: {orderDetails?.orderNumber})
          </DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-8 pt-2 grid-cols-3">
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm col-span-1">
                <div className="space-y-0.5">
                  <Label>GST</Label>
                  <div className="text-sm font-light">
                    GST will be applied from the shop settings.
                  </div>
                </div>

                <Switch checked={gstCharge} onCheckedChange={setGstCharge} />
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm col-span-1">
                <div className="space-y-0.5">
                  <Label>Service charges</Label>
                  <div className="text-sm font-light">
                    Service charges will be applied from the shop settings.
                  </div>
                </div>

                <Switch
                  checked={serviceCharge}
                  onCheckedChange={setServiceCharge}
                />
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm col-span-1">
                <div className="space-y-0.5">
                  <Label>Packing charges</Label>
                  <div className="text-sm font-light">
                    Check this to enable container charges
                  </div>
                </div>

                <Switch
                  checked={packingCharge}
                  onCheckedChange={setPackingCharge}
                />
              </div>
              <div className="space-y-0.5 col-span-1">
                <Label htmlFor="offerCode" className="text-right">
                  Packing charge amount
                </Label>
                <Input
                  id="packingCharges"
                  disabled={!packingCharge}
                  placeholder="Enter packing charges amount"
                />
              </div>
              <div className="space-y-0.5 col-span-1">
                <Label htmlFor="offerCode" className="text-right">
                  Offer code
                </Label>
                <Input id="offerCode" placeholder="Enter offer code" />
              </div>
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
                  checked={false}
                  // onCheckedChange={field.onChange}
                />
              </div>
              <div className="space-y-0.5 col-span-1">
                <Label htmlFor="offerCode" className="text-right">
                  Payment amount
                </Label>
                <Input
                  id="offerCode"
                  disabled={true}
                  placeholder="Enter payment amount"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="font-medium">Bill Preview</div>
            <div className="mt-2">
              <ScrollArea style={{ maxHeight: 'calc(100svh - 320px)' }}>
                <Table className="text-xs border border-dashed rounded">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">
                        Item
                      </TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
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
                      <TableCell className="text-right">
                        {formatPrice(totalPrice || 0)}
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
                        <TableCell className="text-right">
                          {formatPrice(discount)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {gst ? (
                      <TableRow className="font-normal">
                        <TableCell>GST</TableCell>
                        <TableCell className="text-center">5%</TableCell>
                        <TableCell className="text-right">
                          {formatPrice(gst)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {serviceChargeAmnt ? (
                      <TableRow className="font-normal">
                        <TableCell>Service charges</TableCell>
                        <TableCell className="text-center">7%</TableCell>
                        <TableCell className="text-right">
                          {formatPrice(serviceChargeAmnt)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {packingCharge ? (
                      <TableRow className="font-normal">
                        <TableCell>Packing charges</TableCell>
                        <TableCell className="text-center">
                          {/* {orderDetails?.items?.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0,
                      )} */}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(0)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    <TableRow className="border-t">
                      <TableCell>Final</TableCell>
                      <TableCell className="text-center"></TableCell>
                      <TableCell className="text-right">
                        {formatPrice(
                          (totalPrice || 0) + serviceChargeAmnt + gst,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-row justify-end">
          <Button disabled={!paymentMode} onClick={handleGenerateBillClick}>
            Generate Bill
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BillingForm;
