import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { LayoutHeader, Layout, LayoutBody } from '@/components/custom/layout';
import { SyncStatusBar } from '@/components/sync-status-bar';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { getShopDetails } from '@/redux/features/shopSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getShopConfig } from '@/redux/features/configSlice';

export default function ShopLayout() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const { shopId } = useParams<{ shopId: string }>();
  const shopState = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const content = useRef<HTMLDivElement>(null);

  const fetchShopDetails = useCallback(async (id: string) => {
    return dispatch(getShopDetails(id)).unwrap();
  }, []);

  const fetchShopConfig = useCallback(async (id: string) => {
    return dispatch(getShopConfig(id)).unwrap();
  }, []);

  useEffect(() => {
    if (shopId) {
      fetchShopDetails(shopId);
      fetchShopConfig(shopId);
    }
  }, [shopId, fetchShopDetails, fetchShopConfig]);

  useEffect(() => {
    if (content.current) {
      content.current.onscroll = function () {
        if (content.current?.scrollTop === 0) {
          setScrolled(false);
        } else {
          setScrolled(true);
        }
      };
    }

    // return () => {
    //   window.removeEventListener('scroll', () => {});
    // };
  }, [content]);

  if (!shopId && shopState.data === null) {
    return null;
  }
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`bg-muted/40 fixed left-0 right-0 top-0 overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? 'md:ml-14' : 'md:ml-64'
        } h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <LayoutHeader
            className={`sticky top-0 justify-between px-4 py-3 ${
              scrolled ? 'shadow bg-background' : ''
            } md:px-4`}
          >
            {/* <TopNav links={topNav} /> */}
            <div className="ml-auto flex items-center space-x-4">
              <SyncStatusBar />
              <ThemeSwitch />
              <UserNav />
            </div>
          </LayoutHeader>
          <LayoutBody className="space-y-2 overflow-y-auto" ref={content}>
            <Outlet />
          </LayoutBody>
        </Layout>
      </main>
    </div>
  );
}
