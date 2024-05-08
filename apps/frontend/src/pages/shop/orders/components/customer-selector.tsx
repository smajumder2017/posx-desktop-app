import { PhoneInput } from '@/components/ui/phone-input';
import { useState } from 'react';
import { Country } from 'react-phone-number-input';

const CustomerSelector = () => {
  const [, setCountry] = useState<Country>();
  const [phoneNumber, setPhoneNumber] = useState('');
  console.log(phoneNumber);
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        {/* <Label htmlFor="name" className="text-right">
      Name
    </Label> */}
        {/* <Input
          id="phoneNumber"
          placeholder="Enter customer phone number"
          className="col-span-4"
        /> */}
        <PhoneInput
          // countrySelectProps={{ disabled: false }}
          onCountryChange={setCountry}
          className="col-span-4"
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="Enter a phone number"
          defaultCountry="IN"
        />
      </div>
      {/* <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="username" className="text-right">
      Username
    </Label>
    <Input id="username" value="@peduarte" className="col-span-3" />
  </div> */}
    </div>
  );
};

export default CustomerSelector;
