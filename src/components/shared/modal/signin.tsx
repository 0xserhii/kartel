import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"

const SignInModal = () => {

    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type])
    const isOpen = openModal && type === ModalType.LOGIN;
    const modal = useModal();
    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.LOGIN)
        }
    }

    const handleSignUp = async () => {
        modal.open(ModalType.SIGNUP)
    }

    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10">
                <DialogHeader>
                    <DialogTitle className='text-white text-center text-3xl'>Log In</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-7 mt-9">
                    <div className='flex flex-col w-full gap-5'>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Email / Username
                            </p>
                            <Input
                                name='username'
                                type='text'
                                placeholder='username or email'
                                className='text-white border border-gray-700 placeholder:text-gray-700'
                            />
                        </div>
                        <div className="grid flex-1 gap-3 w-full">
                            <p className='text-gray-300'>
                                Password
                            </p>
                            <Input
                                name='password'
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
                                className="text-gray-300 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>
                        <a href="" className='text-[#049DD9] text-sm font-semibold'>
                            Forgot password?
                        </a>
                    </div>
                    <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full'>login</Button>
                    <p className='text-gray-300'>
                        Don’t have an account ?{' '}<button className='text-[#049DD9] font-semibold' onClick={handleSignUp}>Register</button>{' '}now
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInModal