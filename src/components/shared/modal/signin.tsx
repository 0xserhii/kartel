import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { z } from "zod";
import useToast from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPost, setAccessToken } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/redux/actions";
import { useAppSelector } from "@/store/redux";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Adapter, useWallet } from "@/provider/crypto/wallet";
import { StdSignature } from "@keplr-wallet/types";

const SignInSchema = z.object({
  username: z.string().nonempty("Full Name is required"),
  wallet: z.string().nonempty("Wallet is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignInDefaultValue = {
  username: "",
  password: "",
  wallet: "",
};

const SignInModal = () => {
  const [signedSig, setSignedSig] = useState<StdSignature | undefined>(
    undefined
  );
  const toast = useToast();
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const userState = useAppSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const isOpen = modalState.open && modalState.type === ModalType.LOGIN;
  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValue,
  });
  const { account, disconnect, adapter, chainInfo } = useWallet();

  const handleRememberMe = () => {
    if (
      signInForm.getValues("username") === "" &&
      signInForm.getValues("password") === "" &&
      !userState.remember
    ) {
      toast.error("Please fill the inputs");
      return;
    } else {
      dispatch(userActions.rememberMe(!userState.remember));
    }
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.LOGIN);
    }
  };

  const handleSignUp = async () => {
    modal.open(ModalType.SIGNUP);
  };

  const handleConnectWallet = async () => {
    try {
      if (account?.address && signedSig) {
        disconnect();
        setSignedSig(undefined);
        return;
      } else if (account?.address) {
        onChangeWalletAddress();
        return;
      } else {
        modal.open(ModalType.WALLETCONNECT, ModalType.LOGIN);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof SignInSchema>) => {
    if (!signedSig) {
      toast.error("Please sign in with wallet");
      return;
    }
    try {
      const signInPayload = {
        username: data.username,
        password: data.password,
        signAddress: data.wallet,
        signedSig,
      };
      const resSignIn = await axiosPost([
        BACKEND_API_ENDPOINT.auth.signIn,
        { data: signInPayload },
      ]);
      if (resSignIn?.auth?.accessToken) {
        setAccessToken(resSignIn?.auth?.accessToken);
        await dispatch(
          userActions.userData({ ...resSignIn?.user, password: data.password })
        );
        toast.success("SignIn Success");
        modal.close(ModalType.LOGIN);
        return;
      }
    } catch (error: any) {
      toast.error(error?.error);
    }
  };

  const onChangeWalletAddress = async () => {
    try {
      if (account?.address && !signedSig && isOpen) {
        let signedTx: StdSignature | undefined = undefined;
        if (adapter === Adapter.Keplr) {
          const chainId = chainInfo.chainId;
          const signed = await window.keplr?.signArbitrary(
            chainId,
            account?.address ?? "",
            "Sign in to Kartel Project"
          );
          if (signed) {
            signedTx = signed;
          }
        } else if (adapter === Adapter.Leap) {
          const chainId = chainInfo.chainId;
          const signed = await window.leap?.signArbitrary(
            chainId,
            account?.address ?? "",
            "Sign in to Kartel Project"
          );
          if (signed) {
            signedTx = signed;
          }
        }
        if (!signedTx) {
          toast.error("Please sign wallet");
          return;
        }
        setSignedSig(signedTx);
        signInForm.setValue("wallet", account.address);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please sign wallet");
    }
  };
  useEffect(() => {
    if (userState.remember) {
      dispatch(
        userActions.setCredential({
          username: userState.credentials.username,
          password: userState.credentials.password,
        })
      );
    }
    const { username, password } = userState.remember
      ? userState.credentials
      : { username: "", password: "" };
    signInForm.setValue("username", username);
    signInForm.setValue("password", password);
  }, []);

  useEffect(() => {
    onChangeWalletAddress();
  }, [account?.address]);

  useEffect(() => {
    if (
      userState.remember &&
      signInForm.getValues("username") &&
      signInForm.getValues("password")
    ) {
      dispatch(
        userActions.setCredential({
          username: signInForm.getValues("username"),
          password: signInForm.getValues("password"),
        })
      );
    } else {
      dispatch(userActions.removeCredential());
    }
  }, [userState.remember]);

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            Log In
          </DialogTitle>
        </DialogHeader>
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(handleSubmit)}>
            <div className="mt-3 flex flex-col items-center gap-7">
              <div className="flex w-full flex-col gap-5">
                <div className="grid w-full flex-1 gap-2">
                  <p className="text-sm text-gray-300">Username</p>
                  <FormField
                    control={signInForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="username"
                            className="border border-gray-700 text-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-2">
                  <p className="text-sm text-gray-300">Password</p>
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PasswordInput
                            placeholder="*****"
                            className="border border-gray-700 text-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-2">
                  <p className="text-sm text-gray-300">Wallet Address</p>
                  <FormField
                    control={signInForm.control}
                    name="wallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            readOnly
                            contentEditable={false}
                            type="text"
                            placeholder="kujira1*****"
                            className="border border-gray-700 text-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-end">
                    <span
                      className="cursor-pointer text-sm font-semibold text-[#049DD9] hover:underline hover:underline-offset-4"
                      onClick={handleConnectWallet}
                    >
                      {account?.address && signedSig
                        ? "Disconnect"
                        : "Connect Wallet"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={userState?.remember}
                    id="terms"
                    className="text-[#049DD9]"
                    onClick={handleRememberMe}
                  />
                  <label
                    htmlFor="terms"
                    className="select-none text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Button
                className="w-full bg-purple py-5 capitalize hover:bg-purple"
                type="submit"
              >
                login
              </Button>
              <p className="flex text-sm text-gray-300">
                Don’t have an account ?&nbsp;
                <span
                  className="cursor-pointer font-semibold text-[#049DD9]"
                  onClick={handleSignUp}
                >
                  Register
                </span>
                &nbsp;now
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
