import { adminWallets, tabItems } from "@/constants/data";
import { cn } from "@/utils/utils";
import { usePathname } from "@/hooks";
import { Link } from "react-router-dom";
import { useWallet } from "@/provider/crypto/wallet";

type THeadingProps = {
  className?: string;
  userRole: string;
};

export default function Heading({ className, userRole }: THeadingProps) {
  const pathname = usePathname();
  const { account } = useWallet();
  let items = tabItems;

  if (userRole === "ADMIN" || adminWallets.includes(account?.address || "")) {
    items = [
      { name: "Home", path: "/" },
      { name: "Leaderboard", path: "/leader-board" },
      { name: "Dashboard", path: "/dashboard" },
    ];
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            "min-h-full rounded-none border-b-2 border-b-transparent px-5 py-5 text-sm text-gray-300 hover:bg-transparent",
            pathname === item.path && "text-lg font-semibold text-purple"
          )}
        >
          <span className="font-semibold uppercase">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
