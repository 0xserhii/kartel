import DashboardNav from '@/components/shared/dashboard-nav';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/assets/logo.svg';

type TMobileSidebarProps = {
  className?: string;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
};
export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen
}: TMobileSidebarProps) {
  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="bg-dark !px-0 border-none">
          <div className="flex flex-col gap-8 items-center w-full p-5 ">
            <Link to="/" className="py-2 text-2xl font-bold text-white ">
              <img src={Logo} alt='Logo' />
            </Link>
            <div className="space-y-1 px-2 w-full">
              <DashboardNav items={navItems} setOpen={setSidebarOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
