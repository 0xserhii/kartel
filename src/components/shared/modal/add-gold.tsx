import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useRootStore from '@/store/root';
import { ModalType } from '@/types/modal';
import useModal from '@/routes/hooks/use-modal';

const AddGoldModal = () => {
  const modal = useModal();
  const [openModal, type] = useRootStore((store) => [
    store.state.modal.open,
    store.state.modal.type
  ]);

  const isOpen = openModal && type === ModalType.ADDGOLD;

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.ADDGOLD);
    }
  };

  return (
    <Dialog open={false} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            Add Gold
          </DialogTitle>
        </DialogHeader>
        <div className="h-60"></div>
        <Button
          className="w-full bg-[#F205B3] py-5 hover:bg-[#F205B3]"
          type="submit"
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoldModal;
