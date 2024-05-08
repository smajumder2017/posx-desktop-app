import { useState } from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PinInput, PinInputField } from '@/components/custom/pin-input';
import { Separator } from '@/components/ui/separator';

interface OtpFormProps {
  handleSubmit: (number: string) => Promise<void>;
}

const formSchema = z.object({
  license: z.string().min(1, { message: 'Please enter your otp code.' }),
});

export function OtpForm({ ...props }: OtpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { license: '' },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log({ data });
    await props.handleSubmit(data.license);
    form.reset();
    setIsLoading(false);
  }

  return (
    <div className={cn('grid gap-6')} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <PinInput
                      {...field}
                      className="flex h-10 justify-between"
                      onComplete={() => setDisabledBtn(false)}
                      onIncomplete={() => setDisabledBtn(true)}
                    >
                      {Array.from({ length: 19 }, (_, i) => {
                        if ([4, 9, 14].includes(i))
                          return (
                            <Separator
                              key={i}
                              orientation="vertical"
                              className="ml-1 mr-1"
                            />
                          );
                        return (
                          <PinInputField
                            key={i}
                            component={Input}
                            className={`ml-1 mr-1 ${
                              form.getFieldState('license').invalid
                                ? 'border-red-500'
                                : ''
                            }`}
                          />
                        );
                      })}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" disabled={disabledBtn} loading={isLoading}>
              Verify
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
