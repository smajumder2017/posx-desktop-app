import React, { useCallback, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getValidLicense } from '@/redux/features/licenseSlice';
import { RequestStatus } from '@/utils/enums';

const LicenseWrapper: React.FC<React.PropsWithChildren<object>> = (props) => {
  const licenseState = useAppSelector((state) => state.license);
  const dispatch = useAppDispatch();
  // const [loader, setLoader] = useState(false);
  const location = useLocation();

  const fetchLicenses = useCallback(
    async () => dispatch(getValidLicense()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const validLicense = licenseState.data?.id;

  if (validLicense) {
    return <>{props.children}</>;
  }

  if (licenseState.asyncStatus === RequestStatus.Success && !validLicense) {
    return <Navigate to={`/license`} state={{ from: location }} replace />;
  }

  if (licenseState.asyncStatus === RequestStatus.Failed) {
    return <Navigate to={`/license`} state={{ from: location }} replace />;
  }

  return null;
};

export default LicenseWrapper;
