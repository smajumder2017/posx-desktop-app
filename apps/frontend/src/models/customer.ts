export interface ICustomer {
  id: string;
  contactNo: string;
  name: string;
  gender: string;
  dob: Date;
}

export interface ICreateCustomer {
  contactNo: string;
  name: string;
  gender?: string;
  dob?: Date | null;
}
