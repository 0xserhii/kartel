import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"
import useToast from "@/routes/hooks/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { axiosPost } from "@/lib/axios"
import { BACKEND_API_ENDPOINT } from "@/lib/constant"


const SignUpSchema = z.object({
    username: z.string().nonempty('Full Name is required'),
    email: z.string().nonempty('Email is required').email('Email must be a valid email address'),
    password: z.string()
        .nonempty('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
        .nonempty('Confirm Password is required')
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must match',
            path: ['confirmPassword'],
        });
    }
});

const SignUpDefaultValue = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
}


const SignUpModal = () => {

    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type])
    const isOpen = openModal && type === ModalType.SIGNUP;
    const modal = useModal();
    const toast = useToast()

    const signUpForm = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: SignUpDefaultValue
    })

    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.SIGNUP)
        }
    }

    const handleSignIn = async () => {
        modal.open(ModalType.LOGIN)
    }

    const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        try {
            const signUpPayload = {
                username: data.username,
                email: data.email,
                password: data.password
            }
            await axiosPost([BACKEND_API_ENDPOINT.auth.signUp, { data: signUpPayload }])
            modal.close(ModalType.SIGNUP)
            modal.open(ModalType.LOGIN)
            toast.success("SignUp Success")
        } catch (error) {
            console.log(error)
            toast.error("SignUp Failed")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-sm bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10">
                <DialogHeader>
                    <DialogTitle className='text-white text-center text-3xl'>Register</DialogTitle>
                </DialogHeader>
                <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col items-center gap-7 mt-3">
                            <div className='flex flex-col w-full gap-3'>
                                <div className="grid flex-1 gap-1 w-full">
                                    <p className='text-gray-300 text-sm'>
                                        Username
                                    </p>
                                    <FormField
                                        control={signUpForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type='text'
                                                        placeholder='username'
                                                        className='text-white border border-gray-700 placeholder:text-gray-700'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid flex-1 gap-1 w-full">
                                    <p className='text-gray-300 text-sm'>
                                        Email
                                    </p>
                                    <FormField
                                        control={signUpForm.control}
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
                                <div className="grid flex-1 gap-1 w-full">
                                    <p className='text-gray-300 text-sm'>
                                        Password
                                    </p>
                                    <FormField
                                        control={signUpForm.control}
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
                                <div className="grid flex-1 gap-1 w-full">
                                    <p className='text-gray-300 text-sm'>
                                        Confirm Password
                                    </p>
                                    <FormField
                                        control={signUpForm.control}
                                        name="confirmPassword"
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
                                        className="text-gray-300 text-sm italic leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Agree with our Terms & Conditions
                                    </label>
                                </div>
                            </div>
                            <Button type="submit" className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full'>Register</Button>
                            <p className='text-gray-300 text-sm flex'>
                                Already have an account ?&nbsp;<div className='text-[#049DD9] font-semibold cursor-pointer' onClick={handleSignIn}>Login</div>&nbsp;to start
                            </p>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default SignUpModal;