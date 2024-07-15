import { ModalType } from "@/types/modal";

export function openModal(payload: {
  current: ModalType;
  after: ModalType | null;
}) {
  return {
    type: "OPEN_MODAL",
    payload: payload,
  };
}

export function closeModal(modalType: ModalType) {
  return {
    type: "CLOSE_MODAL",
    payload: modalType,
  };
}
