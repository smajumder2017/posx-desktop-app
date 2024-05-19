import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { useCheckOnline } from '@/hooks/use-check-online';
import { LayoutHeader, Layout } from '@/components/custom/layout';
import { SyncStatusBar } from '@/components/sync-status-bar';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

export default function OrdersLayout() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const online = useCheckOnline();
  console.log(online);
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? 'md:ml-14' : 'md:ml-64'
        } h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <LayoutHeader>
            {/* <TopNav links={topNav} /> */}
            <div className="ml-auto flex items-center space-x-4">
              <SyncStatusBar />
              <ThemeSwitch />
              <UserNav />
            </div>
          </LayoutHeader>
          <Outlet />
        </Layout>
      </main>
    </div>
  );
}
