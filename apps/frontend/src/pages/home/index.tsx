import { useAppSelector } from '@/hooks/redux';
import { RequestStatus } from '@/utils/enums';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const authState = useAppSelector((state) => state.auth);
  const licenseState = useAppSelector((state) => state.license);
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
  return <div>Hello</div>;
};

export default Home;
