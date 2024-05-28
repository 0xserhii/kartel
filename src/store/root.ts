import { ModalType } from '@/types/modal';
import { create } from 'zustand';


interface IModal {
    type: ModalType;
    open: boolean;
}

type TRootState = {
    modal: IModal
}

type TRootAction = {
    setModal: (args: IModal) => void;
}

type TRootStore = {
    state: TRootState;
    actions: TRootAction
}

const initialState: TRootState = {
    modal: {
        type: ModalType.LOGIN,
        open: false
    }
}

const useRootStore = create<TRootStore>((set, get) => ({
    state: initialState,
    actions: {
        setModal: (modalType) => {
            set({ state: { ...get().state, modal: modalType } })
        }
    }
}))

export default useRootStore