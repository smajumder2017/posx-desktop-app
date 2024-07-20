import { Button } from '@/components/custom/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import CustomerForm from '../components/customer-form';
import CustomerSelector from '../components/customer-selector';
import { useNavigate, useParams } from 'react-router-dom';
import { ICustomer } from '@/models/customer';
import ServicableAreaChecker from '../components/service-area-checker';
import { LocationResultsEntity } from '@/models/location';

const Delivery = () => {
  const [tab, setTab] = useState('pastorders');
  const [contactNo, setContactNo] = useState('');
  const [customerSelector, setCustomerSelector] = useState(false);
  const [customer, setCustomer] = useState<ICustomer>();
  const navigate = useNavigate();

  const { shopId } = useParams<{
    shopId: string;
  }>();

  console.log(shopId);
  const handleTabChange = (value: string) => {
    setTab(value);
    // setSearchParams((prev) => {
    //   prev.delete('page');
    //   return prev;
    // });
  };
  const hanldeCustomerSelect = (contactNo: string, customer?: ICustomer) => {
    if (customer) {
      setCustomer(customer);
      // navigate(customer.id);
      setCustomerSelector(false);
      return;
    }
    setContactNo(contactNo);
  };

  const handleProceed = (address: LocationResultsEntity) => {
    if (customer && address) {
      navigate(`${customer.id}?placeId=${address.place_id}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Delivery
        </h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setCustomerSelector(true)}>
            New Delivery
          </Button>
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
            <TabsTrigger value="orderrequests">Order Requests</TabsTrigger>
            {/* <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="pastorders" className="flex gap-4"></TabsContent>
        <TabsContent value="ongoingorders" className="flex gap-4"></TabsContent>
        <TabsContent value="orderrequests" className="flex gap-4"></TabsContent>
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
              {contactNo
                ? 'Enter new customer details.'
                : 'Enter customer phone number to get the deatils.'}
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
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!customer}
        onOpenChange={(value) => {
          setCustomerSelector(value);
          setCustomer(undefined);
          setContactNo('');
        }}
      >
        <DialogContent className="sm:max-w-[425px] z-index-999">
          <DialogHeader>
            <DialogTitle>Check Servicable Area</DialogTitle>
            <DialogDescription>
              Enter customer address or landmark to determine if area is
              servicable or not.
            </DialogDescription>
          </DialogHeader>
          <ServicableAreaChecker
            onLandmarkSelect={handleProceed}
            onDismiss={() => {
              setCustomerSelector(false);
              setCustomer(undefined);
              setContactNo('');
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Delivery;
