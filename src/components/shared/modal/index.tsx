import AddGoldModal from "./add-gold";
import CrashInfoModal from "./crash-info-modal";
import DepositModal from "./deposit";
import SignInModal from "./signin";
import SignUpModal from "./signup";
import WalletDepositModal from "./wallet-connect";
import ResetPasswordModal from "./reset-password";

const Modal = () => {
  return (
    <>
      <SignInModal />
      <SignUpModal />
      <DepositModal />
      <AddGoldModal />
      <CrashInfoModal />
      <WalletDepositModal />
      <ResetPasswordModal />
    </>
  );
};

export default Modal;
