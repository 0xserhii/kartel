import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import useRootStore from '@/store/zustand/root';
import { ModalType } from '@/types/modal';
import useModal from '@/routes/hooks/use-modal';
import { z } from 'zod';
import useToast from '@/routes/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosPost, setAccessToken } from '@/lib/axios';
import { BACKEND_API_ENDPOINT } from '@/lib/constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { usePersistStore } from '@/store/zustand/persist';

const SignInSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Email must be a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const SignInDefaultValue = {
  email: '',
  password: ''
};

const SignInModal = () => {
  const toast = useToast();
  const modal = useModal();
  const [openModal, type] = useRootStore((store) => [
    store.state.modal.open,
    store.state.modal.type
  ]);
  const setUserData = usePersistStore((store) => store.actions.setUserData);

  const isOpen = openModal && type === ModalType.LOGIN;

  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValue
  });

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.LOGIN);
    }
  };

  const handleSignUp = async () => {
    modal.open(ModalType.SIGNUP);
  };

  const handleSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      const signInPayload = {
        email: data.email,
        password: data.password
      };
      const resSignIn = await axiosPost([
        BACKEND_API_ENDPOINT.auth.signIn,
        { data: signInPayload }
      ]);
      console.log(resSignIn);
      if (resSignIn?.responseObject?.auth?.accessToken) {
        setAccessToken(resSignIn?.responseObject?.auth?.accessToken);
        await setUserData(resSignIn?.responseObject?.user);
        toast.success('SignIn Success');
        modal.close(ModalType.LOGIN);
        return;
      }
      toast.error('SignIn Failed');
    } catch (error) {
      console.log(error);
      toast.error('SignIn Failed');
    }
  };
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
                <div className="grid w-full flex-1 gap-3">
                  <p className="text-gray-300">Email</p>
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="email"
                            className="border border-gray-700 text-white placeholder:text-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-3">
                  <p className="text-gray-300">Password</p>
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
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
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="text-[#049DD9] " />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <a href="" className="text-sm font-semibold text-[#049DD9]">
                  Forgot password?
                </a>
              </div>
              <Button
                className="w-full bg-[#A326D4] py-5 hover:bg-[#A326D4]"
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
