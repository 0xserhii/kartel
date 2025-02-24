import { cn } from "@/utils/utils";
import { NavItem, NavItemGroup } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "@/hooks";

type DashboardNavProps = {
  items: NavItemGroup[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavItemProps = {
  item: NavItem;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavGroupProps = {
  item: NavItemGroup;
};

const DashboardNavItem = ({ item, setOpen }: DashboardNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  return (
    <Link
      key={item.href}
      target={item.href.includes("https://") ? "_blank" : undefined}
      className={cn(
        "flex transform items-center rounded-[6px] bg-dark-blue px-5 py-[6px] text-gray300 transition-colors duration-300 hover:bg-purple hover:text-gray100",
        isActive && "bg-purple text-white"
      )}
      to={item.href}
    >
      <img src={item.icon} className="h-5 w-5" aria-hidden="true" />
      <div className="flex items-center w-full justify-center">
        <span className="text-xl tracking-wide text-gray-200 font-secondary whitespace-nowrap">
          {item.label}
        </span>
      </div>
    </Link>
  );
};

const DashboardNavGroup = ({ item }: DashboardNavGroupProps) => {
  const [isOpen, setOpen] = useState(item.title === "Mini Games");

  const Icon = isOpen ? ChevronDown : ChevronUp;

  return (
    <Collapsible
      className="w-full data-[state='closed']:!h-6"
      open={isOpen}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger asChild>
        <div className=" flex  w-full cursor-pointer select-none items-center justify-between">
          <span className="text-xl font-bold tracking-wide font-secondary text-gray500 lowercase">{item.title}</span>
          <Icon className="h-4 w-4 text-gray500" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-6 flex flex-col gap-2 transition-transform duration-100 ease-out">
        {item.items.map((subitem, index) => (
          <DashboardNavItem key={index} item={subitem} setOpen={setOpen} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex w-full flex-col gap-7">
      {items.map((item) => (
        <DashboardNavGroup key={item.title} item={item} />
      ))}
    </nav>
  );
}
