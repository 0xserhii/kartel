import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import useToast from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { axiosPost } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import { useAppSelector } from "@/store/redux";
import { PasswordInput } from "@/components/ui/password-input";
import { useWallet } from "@/provider/crypto/wallet";
import { useEffect, useState } from "react";

const SignUpSchema = z
  .object({
    username: z.string().nonempty("Full Name is required"),
    wallet: z.string().nonempty("Wallet is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

const SignUpDefaultValue = {
  username: "",
  password: "",
  confirmPassword: "",
  wallet: "",
};

const SignUpModal = () => {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const modal = useModal();
  const toast = useToast();
  const { account, disconnect } = useWallet();
  const isOpen = open && type === ModalType.SIGNUP;

  const signUpForm = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: SignUpDefaultValue,
  });

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.SIGNUP);
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (account?.address) {
        disconnect();
        return;
      }
      modal.open(ModalType.WALLETCONNECT, ModalType.SIGNUP);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      const signUpPayload = {
        username: data.username,
        password: data.password,
        signAddress: data.wallet,
      };
      await axiosPost([
        BACKEND_API_ENDPOINT.auth.signUp,
        { data: signUpPayload },
      ]);
      modal.close(ModalType.SIGNUP);
      modal.open(ModalType.LOGIN);
      toast.success("SignUp Success");
    } catch (error: any) {
      toast.error(error?.error);
    }
  };

  useEffect(() => {
    if (account?.address) {
      signUpForm.setValue("wallet", account.address);
    }
  }, [account?.address]);
  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            Register
          </DialogTitle>
        </DialogHeader>
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(handleSubmit)}>
            <div className="mt-3 flex flex-col items-center gap-7">
              <div className="flex w-full flex-col gap-3">
                <div className="grid w-full flex-1 gap-2">
                  <p className="text-sm text-gray-300">Username</p>
                  <FormField
                    control={signUpForm.control}
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
                    control={signUpForm.control}
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
                  <p className="text-sm text-gray-300">Confirm Password</p>
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
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
                    control={signUpForm.control}
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
                      {account?.address ? "Disconnect" : "Connect Wallet"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple py-5 hover:bg-purple"
              >
                Register
              </Button>
              <p className="flex text-sm text-gray-300">
                Already have an account ?&nbsp;
                <span
                  className="cursor-pointer font-semibold text-[#049DD9]"
                  onClick={handleSignIn}
                >
                  Login
                </span>
                &nbsp;to start
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
