import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"
import { ChevronRight } from "lucide-react"
import { Adapter, useWallet } from "@/provider/wallet"
import { useState } from "react"
import useToast from "@/routes/hooks/use-toast"

interface ITokenList {
    name: string,
    image: string,
}

const tokenList: ITokenList[] = [
    {
        name: "Keplr",
        image: "/assets/tokens/keplr.svg",
    },
    {
        name: "Leap",
        image: "/assets/tokens/leap.svg",
    },
    {
        name: "Cosmotation",
        image: "/assets/tokens/cosmostation.svg",
    },
]


const defaultLoading = {
    keplr: false,
    cosmostation: false,
    leap: false,
}

const WalletConnectModal = () => {
    const modal = useModal();
    const [, setLoading] = useState(defaultLoading);
    const toast = useToast()

    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type]);
    const isOpen = openModal && type === ModalType.WALLETCONNECT;
    const { connect, account } = useWallet()

    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.WALLETCONNECT)
        }
    }

    const handleConnectWalet = async (walletType: string) => {
        try {
            switch (walletType) {
                case 'Keplr':
                    setLoading((prev) => ({ ...prev, keplr: true }))
                    await connect(Adapter.Keplr)
                    break;
                case 'Leap':
                    setLoading((prev) => ({ ...prev, leap: true }))
                    await connect(Adapter.Leap)
                    break;
                case 'Cosmotation':
                    setLoading((prev) => ({ ...prev, cosmostation: true }))
                    await connect(Adapter.Station)
                    break;
                default:
                    break;
            }
            if (account) {
                toast.success("Wallet connected successfully")
                modal.close(ModalType.WALLETCONNECT)
                modal.open(ModalType.DEPOSIT)
            } else {
                toast.error("User reject connect")
                modal.close(ModalType.WALLETCONNECT)
            }
            setLoading(defaultLoading)
        } catch (error) {
            toast.error("Wallet connect error")
            setLoading(defaultLoading)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-sm bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10 gap-10">
                <DialogHeader className="flex flex-row text-center">
                    <p className="text-white text-2xl text-center">Wallet Connect</p>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {
                        tokenList.map((item, index) => (
                            <button onClick={() => handleConnectWalet(item.name)} className="flex flex-row justify-between items-center gap-2 p-2 rounded-lg" key={index}>
                                <div className="flex flex-row items-center gap-5">
                                    <img src={item.image} className="w-8 h-8" />
                                    <span className="text-white text-lg text-start">
                                        {item.name}
                                    </span>
                                </div>
                                <ChevronRight className="text-white w-5 h-5" />
                            </button>
                        ))
                    }
                </div>
            </DialogContent >
        </Dialog >
    )
}

export default WalletConnectModal;