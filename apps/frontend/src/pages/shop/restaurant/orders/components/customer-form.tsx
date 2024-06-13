import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as apis from '@/apis';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { isMobilePhone } from 'validator';
import { ICreateCustomer, ICustomer } from '@/models/customer';
import { PropsWithChildren, useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  contactNo: z.string().refine((value) => isMobilePhone(value), {
    message: 'Enter a valid contact number',
  }),
});

interface ICustomerFormProps {
  contactNo: string;
  onSuccess?: (contactNo: string, value?: ICustomer) => void;
}

export const CustomerForm: React.FC<PropsWithChildren<ICustomerFormProps>> = (
  props,
) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactNo: props.contactNo,
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const payload: ICreateCustomer = {
        name: values.name,
        contactNo: values.contactNo,
      };
      const res = await apis.createCustomer(payload);
      props.onSuccess && props.onSuccess(values.contactNo, res.data);
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
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
                  // value={phoneNumber}
                  // onChange={setPhoneNumber}
                  placeholder="Enter a phone number"
                  defaultCountry="IN"
                  // onKeyUp={handleSubmit}
                  // disabled={loading}
                  {...field}
                />
                {/* <Input placeholder="Enter contact number" {...field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="contactNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact number" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CustomerForm;
