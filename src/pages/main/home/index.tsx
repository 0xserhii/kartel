import CrashBanner from '/assets/crash-banner.svg';
import CrashTitle from '/assets/crash-title.png';
import MinesTitle from '/assets/mines-title.svg';
import CoinFlipCoin from '/assets/coinflip-coin.svg';
import CoinFlipTitle from '/assets/coinflip-title.png';
import Bommbs from '/assets/bommb.svg';
import InvitedFriends from '/assets/invited-friends.svg';
import CoinflipBanner from '/assets/coinflip-banner.svg';
import MineBanner from '/assets/mine-banner.svg';
import BlackJack from '/assets/blackjack.svg';
import HorseRacing from '/assets/horseracing.svg';
import Roulette from '/assets/roulette.svg';
import Slots from '/assets/slots.svg';
import Playnow from '/assets/playnow.svg'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="flex flex-col items-stretch gap-8 p-12">
                <div className="flex flex-col items-stretch gap-6">
                    <span className="text-xl font-semibold text-gray300 uppercase">casino</span>
                    <div className='flex flex-row w-full h-full gap-8 justify-between'>
                        <div className='w-6/12 h-full'>
                            <div className="relative rounded-md h-full">
                                <img
                                    src={CrashBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full rounded-lg"
                                />
                                <img src={CrashTitle} alt="Crash Title" className="w-24 absolute left-5 top-5 rounded-md" />
                                <Link to="/crash">
                                    <img src={Playnow} alt="Play Now" className="cursor-pointer w-24 absolute left-5 bottom-5 py-2 px-2 bg-white border-4 border-black rounded-md ease-in-out md:hover:scale-[1.3] hover:transition-all" />
                                </Link>
                            </div>
                        </div>
                        <div className='w-6/12 flex flex-row h-full gap-6'>
                            <div className="relative rounded-md w-6/12 object-cover">
                                <img
                                    src={CoinflipBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full rounded-lg"
                                />
                                <img src={CoinFlipTitle} alt="title" className="w-24 absolute right-2 top-2 rounded-md" />
                                <img src={CoinFlipCoin} alt="Play Now" className="w-16 absolute left-6 bottom-6" />
                                <img src={Playnow} alt="Play Now" className="cursor-pointer w-24 absolute right-5 bottom-5 py-2 px-2 bg-white border-4 border-black rounded-md ease-in-out md:hover:scale-[1.3] hover:transition-all" />
                            </div>
                            <div className="relative rounded-md w-6/12">
                                <img
                                    src={MineBanner}
                                    alt="Crash Banner"
                                    className="aspect-auto w-full rounded-lg"
                                />
                                <img src={MinesTitle} alt="title" className="w-24 absolute right-2 top-2 rounded-md" />
                                <img src={Bommbs} alt="Play Now" className="w-10 absolute left-16 bottom-10" />
                                <img src={Playnow} alt="Play Now" className="cursor-pointer w-24 absolute right-5 bottom-5 py-2 px-2 bg-white border-4 border-black rounded-md ease-in-out md:hover:scale-[1.3] hover:transition-all" />
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative rounded-md">
                        <img src={InvitedFriends} alt="Banner Image" className="aspect-auto w-full" />
                    </div>
                    <div className="flex flex-col gap-8">
                        <span className="text-xl font-semibold text-gray300 uppercase">games</span>
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
