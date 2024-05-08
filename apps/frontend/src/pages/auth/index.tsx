import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getUserInfo, login } from '@/redux/features/authSlice';
import { ILoginRequest } from '@/models/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { RequestStatus } from '@/utils/enums';

const AuthPage = () => {
  const authState = useAppSelector((state) => state.auth);
  const licenseState = useAppSelector((state) => state.license);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = useCallback(
    async (payload: ILoginRequest) => dispatch(login(payload)).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const fetchuserInfo = useCallback(
    async () => dispatch(getUserInfo()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const handleLoginClick = async () => {
    try {
      const payload = {
        userName,
        password,
      };
      const response = await handleLogin(payload);
      localStorage.setItem('posxAccessToken', response.data.accessToken);
      const userInfo = await fetchuserInfo();
      console.log(userInfo);

      if (licenseState.data?.shopId)
        navigate('/' + licenseState.data?.shopId + '/dashboard');
    } catch (error) {
      console.log(error);
    }
  };
  if (
    authState.asyncStatus === RequestStatus.Success &&
    licenseState.data?.shopId
  ) {
    return (
      <Navigate
        to={`/${licenseState.data.shopId}/dashboard`}
        // state={{ from: location }}
      />
    );
  }
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your user name below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">User name</Label>
              <Input
                id="username"
                type="text"
                placeholder="someusername"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleLoginClick}>
              Login
            </Button>
            {licenseState.data?.id && (
              <Button variant="outline" className="w-full">
                Go to Management Portal
              </Button>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <a href="#" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default AuthPage;
