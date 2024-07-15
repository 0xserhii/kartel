import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalType } from "@/types/modal";
import useModal from "@/hooks/use-modal";
import { z } from "zod";
import useToast from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPost } from "@/utils/axios";
import { BACKEND_API_ENDPOINT } from "@/utils/constant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAppSelector } from "@/store/redux";
import { PasswordInput } from "@/components/ui/password-input";

const ResetPasswordSchema = z.object({
  userId: z.string(),
  oldPassword: z
    .string()
    .nonempty("Current Password is required")
    .min(6, "Password must be at least 6 characters"),
  newPassword: z
    .string()
    .nonempty("New Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .nonempty("Confirm Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const ResetPasswordModal = () => {
  const toast = useToast();
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const userState = useAppSelector((state: any) => state.user);
  const isOpen = modalState.open && modalState.type === ModalType.RESETPASSWORD;

  const ResetPasswordDefaultValue = {
    userId: userState?.userData?._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const resetPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: ResetPasswordDefaultValue,
  });

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.RESETPASSWORD);
    }
  };

  const handleSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const resetPasswordPayload = {
        userId: data.userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const resResetPassword = await axiosPost([
        BACKEND_API_ENDPOINT.auth.resetPassword,
        { data: resetPasswordPayload },
      ]);

      if (resResetPassword) {
        toast.success("Reset Password Success");
        modal.close(ModalType.RESETPASSWORD);
        resetPasswordForm.reset(ResetPasswordDefaultValue);
        return;
      }
    } catch (error: any) {
      toast.error(error?.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            Reset Password
          </DialogTitle>
        </DialogHeader>
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(handleSubmit)}>
            <div className="mt-3 flex flex-col items-center gap-7">
              <div className="flex w-full flex-col gap-5">
                <div className="grid w-full flex-1 gap-2">
                  <p className="text-sm text-gray-300">Current Password</p>
                  <FormField
                    control={resetPasswordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PasswordInput
                            placeholder="Old Password"
                            autoComplete="new-password"
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
                  <p className="text-sm text-gray-300">New Password</p>
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PasswordInput
                            placeholder="New Password"
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
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirm New Password"
                            className="border border-gray-700 text-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                className="w-full bg-purple py-5 capitalize hover:bg-purple"
                type="submit"
              >
                Reset Password
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
