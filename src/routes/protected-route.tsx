"use client";

import { adminWallets } from "@/constants/data";
import { useWallet } from "@/provider/crypto/wallet";
import { useAppSelector } from "@/store/redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userData = useAppSelector((store: any) => store.user.userData);
  const { account } = useWallet();

  if (
    userData?.role !== "ADMIN" &&
    !adminWallets.includes(account?.address || "")
  ) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default ProtectedRoute;
