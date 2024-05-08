import React, { useCallback, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getUserInfo } from '../../redux/features/authSlice';
import { RequestStatus } from '../../utils/enums';

const AuthWrapper: React.FC<React.PropsWithChildren<object>> = (props) => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const fetchUserInfo = useCallback(
    async () => dispatch(getUserInfo()).unwrap(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  if (authState.asyncStatus === RequestStatus.Success) {
    return <>{props.children}</>;
  }

  if (authState.asyncStatus === RequestStatus.Failed) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  return null;
};

export default AuthWrapper;
