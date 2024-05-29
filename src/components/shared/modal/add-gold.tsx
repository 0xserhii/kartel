import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"

const AddGoldModal = () => {

    const modal = useModal();
    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type])

    const isOpen = openModal && type === ModalType.ADDGOLD;

    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.ADDGOLD)
        }
    }

    return (
        <Dialog open={false} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10">
                <DialogHeader>
                    <DialogTitle className='text-white text-center text-3xl'>Add Gold</DialogTitle>
                </DialogHeader>
                <div className="h-60">
                </div>
                <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full' type="submit">Add</Button>
            </DialogContent >
        </Dialog >
    )
}

export default AddGoldModal;