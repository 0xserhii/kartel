import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"
import { z } from "zod"
import useToast from "@/routes/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { axiosPost, setAccessToken } from "@/lib/axios"
import { BACKEND_API_ENDPOINT } from "@/lib/constant"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { usePersistStore } from "@/store/persist"


const SignInSchema = z.object({
    email: z.string().nonempty('Email is required').email('Email must be a valid email address'),
    password: z.string()
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters')
});

const SignInDefaultValue = {
    email: "",
    password: ""
}

const SignInModal = () => {

    const toast = useToast()
    const modal = useModal();
    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type])
    const setUserData = usePersistStore((store) => store.actions.setUserData)

    const isOpen = openModal && type === ModalType.LOGIN;

    const signInForm = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: SignInDefaultValue
    })

    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.LOGIN)
        }
    }

    const handleSignUp = async () => {
        modal.open(ModalType.SIGNUP)
    }

    const handleSubmit = async (data: z.infer<typeof SignInSchema>) => {
        try {
            const signInPayload = {
                email: data.email,
                password: data.password
            }
            const resSignIn = await axiosPost([BACKEND_API_ENDPOINT.auth.signIn, { data: signInPayload }])
            console.log(resSignIn)
            if (resSignIn?.responseObject?.auth?.accessToken) {
                setAccessToken(resSignIn?.responseObject?.auth?.accessToken)
                await setUserData(resSignIn?.responseObject?.user)
                toast.success("SignIn Success")
                modal.close(ModalType.LOGIN)
                return
            }
            toast.error("SignIn Failed")
        } catch (error) {
            console.log(error)
            toast.error("SignIn Failed")
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-sm bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10">
                <DialogHeader>
                    <DialogTitle className='text-white text-center text-3xl'>Log In</DialogTitle>
                </DialogHeader>
                <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col items-center gap-7 mt-3">
                            <div className='flex flex-col w-full gap-5'>
                                <div className="grid flex-1 gap-3 w-full">
                                    <p className='text-gray-300'>
                                        Email
                                    </p>
                                    <FormField
                                        control={signInForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='email'
                                                        className='text-white border border-gray-700 placeholder:text-gray-700'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid flex-1 gap-3 w-full">
                                    <p className='text-gray-300'>
                                        Password
                                    </p>
                                    <FormField
                                        control={signInForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='*****'
                                                        className='text-white border border-gray-700 placeholder:text-gray-700'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between w-full'>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" className='text-[#049DD9] ' />
                                    <label
                                        htmlFor="terms"
                                        className="text-gray-300 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <a href="" className='text-[#049DD9] text-sm font-semibold'>
                                    Forgot password?
                                </a>
                            </div>
                            <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full' type="submit">login</Button>
                            <p className='text-gray-300 text-sm flex'>
                                Don’t have an account ?&nbsp;<div className='text-[#049DD9] font-semibold cursor-pointer' onClick={handleSignUp}>Register</div>&nbsp;now
                            </p>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default SignInModal