import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useRootStore from "@/store/root"
import { ModalType } from "@/types/modal"
import useModal from "@/routes/hooks/use-modal"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { token } from "@/section/games/crash"
import axios from "axios"
import { usePersistStore } from "@/store/persist"

interface TokenBalances {
    usk: number;
    kuji: number;
}

const DepositModal = () => {
    const modal = useModal();
    const userData = usePersistStore((store) => store.app.userData);
    const [depositAmount, setDepositAmount] = useState(0);
    const [selectedToken, setSelectedToken] = useState(token[0]);
    const [openModal, type] = useRootStore((store) => [store.state.modal.open, store.state.modal.type]);
    const [walletData, setWalletData] = useState<TokenBalances>();

    const isOpen = openModal && type === ModalType.DEPOSIT;


    const hanndleOpenChange = async () => {
        if (isOpen) {
            modal.close(ModalType.DEPOSIT)
        }
    }

    const handleBetAmountChange = (event) => {
        const inputValue = event.target.value;
        setDepositAmount(inputValue);
    };

    const updateBalance = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userData._id}/balance`, {
                balanceType: selectedToken.name,
                actionType: "deposit",
                amount: Number(depositAmount)
            });
            setWalletData(response.data?.responseObject.wallet);
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            updateBalance();
        }
    }, [isOpen]);

    const handleDeposit = () => {
        updateBalance();
    };

    return (
        <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
            <DialogContent className="sm:max-w-sm bg-[#0D0B32] border-2 border-gray-900 rounded-lg p-10 gap-6">
                <DialogHeader className="flex flex-row">
                    <div className="w-full flex flex-row items-center justify-center">
                        <img src="/assets/logo.svg" className="w-24 h-24" />
                    </div>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        {
                            walletData && Object.entries(walletData).map(([tokenName, balance], index) => (
                                <div key={index} className="flex flex-row justify-between items-center">
                                    <span className="uppercase text-gray-300 flex flex-row items-center gap-3">
                                        <img src={`/assets/tokens/${tokenName.toLowerCase()}.png`} className='w-5 h-5' />
                                        {tokenName}
                                    </span>
                                    <span className="text-gray-300">
                                        {balance.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                    <div className='relative'>
                        <Input value={depositAmount} onChange={handleBetAmountChange} type="number" className='text-white border border-purple-0.5 placeholder:text-gray-700' />
                        <span className='absolute top-0 flex items-center justify-center h-full right-4 text-gray500' >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer uppercase">
                                        <img src={selectedToken.src} className='w-4 h-4' />
                                        {selectedToken.name}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-12 bg-[#0D0B32CC] border-purple-0.5">
                                    <DropdownMenuRadioGroup value={selectedToken.name} onValueChange={(value) => {
                                        const newToken = token.find(t => t.name === value);
                                        if (newToken) {
                                            setSelectedToken(newToken);
                                        }
                                    }}>
                                        {token.map((t, index) => (
                                            <DropdownMenuRadioItem key={index} value={t.name} className='text-white hover:bg-transparent gap-5 uppercase'>
                                                <img src={t.src} className='w-4 h-4' />
                                                {t.name}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </span>
                    </div>
                </div>
                <Button className='bg-[#F205B3] py-5 hover:bg-[#F205B3] w-full' type="submit" onClick={handleDeposit}>Deposit</Button>
            </DialogContent >
        </Dialog >
    )
}

export default DepositModal;