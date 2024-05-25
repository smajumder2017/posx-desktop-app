import { Navigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getShopDetails } from '@/redux/features/shopSlice';

export default function ShopContainer() {
  const { shopId } = useParams<{ shopId: string }>();
  const shopState = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  const fetchShopDetails = useCallback(async (id: string) => {
    return dispatch(getShopDetails(id)).unwrap();
  }, []);

  useEffect(() => {
    if (shopId) fetchShopDetails(shopId);
  }, [shopId, fetchShopDetails]);

  if (shopState.data) {
    return (
      <Navigate
        to={`/${
          shopState.data.id
        }/${shopState.data.shopType.value.toLowerCase()}/dashboard`}
        // state={{ from: location }}
      />
    );
  }
  return null;
}
