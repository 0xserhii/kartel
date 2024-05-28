import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"

const SignUpModal = () => {

    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type])
    const isOpen = openModal && type === ModalType.SIGNUP;
    const modal = useModal();
    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.SIGNUP)
        }
    }

    const handleSignIn = async () => {
        modal.open(ModalType.LOGIN)
    }

    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10">
                <DialogHeader>
                    <DialogTitle className='text-white text-center text-3xl'>Register</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-7 mt-9">
                    <div className='flex flex-col w-full gap-5'>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Username
                            </p>
                            <Input
                                name='username'
                                type='text'
                                placeholder='username'
                                className='text-white border border-gray-700 placeholder:text-gray-700'
                            />
                        </div>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Email
                            </p>
                            <Input
                                name='email'
                                type='email'
                                placeholder='email'
                                className='text-white border border-gray-700 placeholder:text-gray-700'
                            />
                        </div>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Password
                            </p>
                            <Input
                                name='password1'
                                type='password'
                                placeholder='******'
                                className='text-white border border-gray-700 placeholder:text-gray-700'
                            />
                        </div>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Confirm Password
                            </p>
                            <Input
                                name='password2'
                                type='password'
                                placeholder='******'
                                className='text-white border border-gray-700 placeholder:text-gray-700'
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
                    <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full'>register</Button>
                    <p className='text-gray-300'>
                        Already have an account ?{' '}<button className='text-[#049DD9] font-semibold' onClick={handleSignIn}>Login</button>{' '}to start
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignUpModal;