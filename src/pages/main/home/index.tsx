import CrashBanner from '@/assets/crash-banner.png';
import InvitedFriends from '@/assets/invited-friends.png';
import CoinflipBanner from '@/assets/coinflip-banner.png';
import MineBanner from '@/assets/mines-banner.png';
import BlackJack from '@/assets/blackjack.png';
import HorseRacing from '@/assets/horseracing.png';
import Roulette from '@/assets/roulette.png';
import Slots from '@/assets/slots.png';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8 p-12">
                <div className="flex flex-col items-stretch gap-6">
                    <span className="text-xl font-semibold text-gray300 uppercase">casino</span>
                    <div className='flex flex-row w-full h-full gap-6 justify-between'>
                        <div className='w-6/12 h-full'>
                            <div className="relative rounded-md">
                                <img
                                    src={CrashBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full"
                                />
                            </div>
                        </div>
                        <div className='w-6/12 flex flex-row h-full gap-6'>
                            <div className="relative rounded-md w-6/12">
                                <img
                                    src={CoinflipBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full"
                                />
                            </div>
                            <div className="relative rounded-md w-6/12">
                                <img
                                    src={MineBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <span className="text-xl font-semibold text-gray300 uppercase">coming soon games</span>
                    <div className="flex flex-col items-center gap-8">
                        <div className="w-full relative rounded-md">
                            <img src={InvitedFriends} alt="Banner Image" className="aspect-auto w-full" />
                        </div>
                        <div className='w-full flex flex-row h-full gap-6 justify-between'>
                            <div className='w-6/12'>
                                <img src={BlackJack} alt="Banner Image" className="aspect-auto w-full" />
                            </div>
                            <div className='w-6/12'>
                                <img src={HorseRacing} alt="Banner Image" className="aspect-auto w-full" />
                            </div>
                        </div>
                        <div className='w-full flex flex-row h-full gap-6 justify-between'>
                            <div className='w-6/12'>
                                <img src={Roulette} alt="Banner Image" className="aspect-auto w-full" />
                            </div>
                            <div className='w-6/12'>
                                <img src={Slots} alt="Banner Image" className="aspect-auto w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
