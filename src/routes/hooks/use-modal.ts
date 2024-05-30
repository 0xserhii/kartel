import useRootStore from '@/store/root';
import { ModalType } from '@/types/modal';

export default function useModal() {
  const setModal = useRootStore((store) => store.actions.setModal);

  const open = (type: ModalType) => setModal({ type, open: true });
  const close = (type: ModalType) => setModal({ type, open: false });

  return { open, close };
}
