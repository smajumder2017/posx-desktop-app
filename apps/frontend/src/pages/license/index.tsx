import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { Link } from 'react-router-dom';
import { OtpForm } from './otp-form';
import * as apis from '../../apis';
import { useCallback, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getValidLicense } from '@/redux/features/licenseSlice';
import { Label } from '@/components/ui/label';
import { prettyDate } from '@/utils/date';
import { Button } from '@/components/custom/button';
import { EyeClosedIcon } from '@radix-ui/react-icons';
// import { RequestStatus } from '@/utils/enums';

const splitNumberInChunks = (
  number: string,
  chunkSize: number,
  joiner: string = ' ',
) => {
  let res = '';
  for (let i = 0; i < number.length; i = i + chunkSize) {
    res +=
      number.substring(i, i + chunkSize) +
      (i + chunkSize >= number.length ? '' : joiner);
  }
  return res;
};

export default function License() {
  const licenseState = useAppSelector((state) => state.license);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLicenses = useCallback(
    async () => dispatch(getValidLicense()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const validateLicense = useCallback(
    async (email: string, password: string, number: string) => {
      try {
        const code = splitNumberInChunks(number, 4, '-');

        const license = await apis.validateLicense({
          email,
          password,
          number: code,
        });
        console.log(license);
        if (license.data.valid) {
          localStorage.setItem('shopId', license.data.license.shopId);
          navigate('/login');
        }
        console.log(license);
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const validLicense = licenseState.data?.id;

  function mask(data: string, charsToMask?: number) {
    return data.split('').map((char, index) => {
      if (index <= (charsToMask || data.length - 1)) {
        return '*';
      }
      return char;
    });
  }

  const havePermission =
    authState.data?.userRoles?.some((userRole) =>
      ['ADMIN', 'OWNER'].includes(userRole.role.value),
    ) || false;

  if (
    validLicense &&
    authState.data &&
    window.location.pathname.includes('settings/license')
  ) {
    return (
      <Card>
        <CardHeader className="px-7">
          <CardTitle>License</CardTitle>
          <CardDescription>Manage shop license here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {licenseState.data?.number && (
            <div>
              <Label>License Number</Label>
              <div className="text-sm flex gap-2 items-center">
                <span>{mask(licenseState.data.number, 14)}</span>
                {havePermission && (
                  <span>
                    <Button size="icon" variant="outline">
                      <EyeClosedIcon fontSize={'12px'} />
                    </Button>
                  </span>
                )}
              </div>
            </div>
          )}
          {licenseState.data?.startDate && (
            <div>
              <Label>Valid From</Label>
              <div className="text-sm">
                {prettyDate(new Date(licenseState.data.startDate))}
              </div>
            </div>
          )}
          {licenseState.data?.endDate && (
            <div>
              <Label>Valid Upto</Label>
              <div className="text-sm">
                {prettyDate(new Date(licenseState.data.endDate))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant={'destructive'} disabled={!havePermission}>
            Detach License
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (validLicense && window.location.pathname === 'license') {
    return <Navigate to={`/`} state={{ from: location }} replace />;
  }

  return (
    <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 lg:p-8">
        <div className="mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <h1 className="text-xl font-medium">PosX</h1>
        </div>
        <Card className="mx-auto p-6">
          <div className="mb-2 flex flex-col space-y-2 text-left">
            <h1 className="text-md font-semibold tracking-tight">
              License validation
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter the license code. <br /> We have sent the license
              code to owners email.
            </p>
          </div>
          <OtpForm handleSubmit={validateLicense} />
          {/* <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              Haven't received it?{' '}
              <Link
                to="/resent-new-code"
                className="underline underline-offset-4 hover:text-primary"
              >
                Resend a new code.
              </Link>
              .
            </p> */}
        </Card>
      </div>
    </div>
  );
}
