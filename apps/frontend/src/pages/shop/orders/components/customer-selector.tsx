import { PhoneInput } from '@/components/ui/phone-input';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import * as apis from '@/apis';
import { ICustomer } from '@/models/customer';
import { Spinner } from '@/components/ui/spinner';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  // FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isMobilePhone } from 'validator';
import { z } from 'zod';

const formSchema = z.object({
  contactNo: z.string().refine((value) => isMobilePhone(value), {
    message: 'Enter a valid contact number',
  }),
});
interface ICustomerSelectorProps {
  onCustomerSelect: (contactNo: string, value?: ICustomer) => void;
}

const CustomerSelector: React.FC<PropsWithChildren<ICustomerSelectorProps>> = (
  props,
) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNo: '',
    },
  });

  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  const getCustomer = useCallback(async (contactNo: string) => {
    setLoading(true);
    try {
      const res = await apis.fetchCustomerDetails({ contactNo });
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log(error);
      // setError(error.message);
    }
    setLoading(false);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const customer = await getCustomer(values.contactNo);
      props.onCustomerSelect(values.contactNo, customer);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      form.handleSubmit(onSubmit)();
    }
  };
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="contactNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <PhoneInput
                // countrySelectProps={{ disabled: false }}
                // onCountryChange={setCountry}
                // className="col-span-4"
                // onChange={setPhoneNumber}
                placeholder="Enter a phone number"
                defaultCountry="IN"
                onKeyUp={handleSubmit}
                disabled={loading}
                {...field}
              />
              {/* <Input placeholder="Enter contact number" {...field} /> */}
            </FormControl>
            {/* <FormDescription>This is your public display name.</FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      {loading && <Spinner />}
    </Form>
  );
  // return (
  //   <div className="grid gap-4 py-4">
  //     <div className="grid grid-cols-4 items-center gap-4">
  //       {/* <Label htmlFor="name" className="text-right">
  //     Name
  //   </Label> */}
  //       {/* <Input
  //         id="phoneNumber"
  //         placeholder="Enter customer phone number"
  //         className="col-span-4"
  //       /> */}
  //       <PhoneInput
  //         // countrySelectProps={{ disabled: false }}
  //         onCountryChange={setCountry}
  //         className="col-span-4"
  //         value={phoneNumber}
  //         onChange={setPhoneNumber}
  //         placeholder="Enter a phone number"
  //         defaultCountry="IN"
  //         onKeyUp={handleSubmit}
  //         disabled={loading}
  //       />
  //     </div>
  //     {loading && <Spinner />}
  //     {/* <div className="grid grid-cols-4 items-center gap-4">
  //   <Label htmlFor="username" className="text-right">
  //     Username
  //   </Label>
  //   <Input id="username" value="@peduarte" className="col-span-3" />
  // </div> */}
  //   </div>
  // );
};

export default CustomerSelector;
