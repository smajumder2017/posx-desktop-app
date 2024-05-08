import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { useCheckOnline } from '@/hooks/use-check-online';

export default function Layout() {
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
        <Outlet />
      </main>
    </div>
  );
}
