import { Card } from '@/components/ui/card';
// import { Link } from 'react-router-dom';
import { OtpForm } from './otp-form';
import * as apis from '../../apis';
import { useCallback, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getValidLicense } from '@/redux/features/licenseSlice';
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
  const dispatch = useAppDispatch();
  // const [loader, setLoader] = useState(false);
  const location = useLocation();

  const fetchLicenses = useCallback(
    async () => dispatch(getValidLicense()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const validateLicense = useCallback(async (number: string) => {
    try {
      const code = splitNumberInChunks(number, 4, '-');

      const license = await apis.validateLicense({ number: code });
      console.log(license);
      if (license.data.valid) {
        localStorage.setItem('shopId', license.data.license.shopId);
      }
      console.log(license);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const validLicense = licenseState.data?.id;

  // if (licenseState.asyncStatus === RequestStatus.Failed) {
  //   return <Navigate to={`/license`} state={{ from: location }} replace />;
  // }

  if (validLicense) {
    return <Navigate to={`/`} state={{ from: location }} replace />;
  }

  return (
    <>
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
    </>
  );
}
