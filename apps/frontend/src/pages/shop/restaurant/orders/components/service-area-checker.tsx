import { PropsWithChildren, useEffect, useState } from 'react';
import * as apis from '@/apis';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  // FormDescription,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { LocationResultsEntity } from '@/models/location';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import haversineDistance from 'haversine-distance';
import { useAppSelector } from '@/hooks/redux';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { IconSquareRoundedCheckFilled } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  landmark: z.string({
    message: 'Enter a valid contact number',
  }),
});
interface ICustomerSelectorProps {
  onLandmarkSelect: (address: LocationResultsEntity) => void;
  onDismiss: () => void;
}

const ServicableAreaChecker: React.FC<
  PropsWithChildren<ICustomerSelectorProps>
> = ({ onLandmarkSelect, onDismiss }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      landmark: '',
    },
  });
  const shopDetails = useAppSelector((state) => state.shop);
  const shopConfig = useAppSelector((state) => state.shopConfig);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResultsEntity>();
  const [error, setError] = useState('');
  const [locations, setLocations] = useState<LocationResultsEntity[]>([]);

  const searchLocation = async (address: string) => {
    setLoading(true);
    try {
      const res = await apis.searchLocation(address);
      setLocations(res.data.results);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setSelectedLocation(undefined);
      setError('');
      await searchLocation(values.landmark);
      // props.onLandmarkSelect(values.landmark, customer);
    } catch (error) {
      console.log(error);
    }
  }

  const checkValidLocation = (loc: LocationResultsEntity) => {
    const serviceRadius = shopConfig.data?.config.delivery.serviceRadius || 0;
    const customerLocation = loc.geometry.location;
    const shopLocation = {
      lat: parseFloat(shopDetails.data?.latitude || '0'),
      lng: parseFloat(shopDetails.data?.longitude || '0'),
    };
    const distance = haversineDistance(customerLocation, shopLocation);
    console.log(distance);
    if (distance > serviceRadius * 1000) {
      setError('This location is outside of servicable area');
    }
    setSelectedLocation(loc);
  };

  const handleDismissClick = () => {
    setError('');
    setSelectedLocation(undefined);
    onDismiss();
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Area/Landmark</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter landmark or area"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Search the location given by customer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className=""
            disabled={loading}
            loading={loading}
            type="submit"
          >
            Check
          </Button>
        </div>
        {locations.length ? (
          <ScrollArea
            style={{
              // height: 'calc(100svh - 500px)',
              maxHeight: 'calc(100svh - 500px)',
            }}
            className="pr-4"
          >
            {locations.map((item) => {
              return (
                <Card
                  key={item.place_id}
                  className="cursor-pointer relative mb-4"
                  onClick={() => checkValidLocation(item)}
                >
                  {selectedLocation?.place_id == item.place_id ? (
                    <div className="absolute top-2 right-2">
                      <IconSquareRoundedCheckFilled />
                    </div>
                  ) : null}
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.formatted_address}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </ScrollArea>
        ) : null}
      </form>
      {error ? (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Not Servicable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {!error && selectedLocation ? (
        <Button onClick={() => onLandmarkSelect(selectedLocation)}>
          Proceed
        </Button>
      ) : null}
      <Button variant={'secondary'} onClick={handleDismissClick}>
        Dismiss
      </Button>
    </Form>
  );
};

export default ServicableAreaChecker;
