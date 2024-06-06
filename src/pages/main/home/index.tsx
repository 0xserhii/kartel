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
import Playnow from '/assets/playnow.svg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex flex-col items-stretch gap-8 p-12">
        <div className="flex flex-col items-stretch gap-6">
          <span className="text-xl font-semibold uppercase text-gray300">
            casino
          </span>
          <div className="flex h-full w-full flex-row justify-between gap-8">
            <div className="h-full w-6/12">
              <div className="relative h-full rounded-md">
                <img
                  src={CrashBanner}
                  alt="Crash Banner"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={CrashTitle}
                  alt="Crash Title"
                  className="absolute left-5 top-5 w-24 rounded-md"
                />
                <Link to="/crash">
                  <img
                    src={Playnow}
                    alt="Play Now"
                    className="absolute bottom-5 left-5 w-24 cursor-pointer rounded-md border-4 border-black bg-white px-2 py-2 ease-in-out hover:transition-all md:hover:scale-[1.3]"
                  />
                </Link>
              </div>
            </div>
            <div className="flex h-full w-6/12 flex-row gap-6">
              <div className="relative w-6/12 rounded-md object-cover">
                <img
                  src={CoinflipBanner}
                  alt="Crash Banner"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={CoinFlipTitle}
                  alt="title"
                  className="absolute right-2 top-2 w-24 rounded-md"
                />
                <img
                  src={CoinFlipCoin}
                  alt="Play Now"
                  className="absolute bottom-6 left-6 w-16"
                />
                <Link to="/coin-flip">
                  <img
                    src={Playnow}
                    alt="Play Now"
                    className="absolute bottom-5 right-5 w-24 cursor-pointer rounded-md border-4 border-black bg-white px-2 py-2 ease-in-out hover:transition-all md:hover:scale-[1.3]"
                  />
                </Link>
              </div>
              <div className="relative w-6/12 rounded-md">
                <img
                  src={MineBanner}
                  alt="Crash Banner"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={MinesTitle}
                  alt="title"
                  className="absolute right-2 top-2 w-24 rounded-md"
                />
                <img
                  src={Bommbs}
                  alt="Play Now"
                  className="absolute bottom-10 left-16 w-10"
                />
                <img
                  src={Playnow}
                  alt="Play Now"
                  className="absolute bottom-5 right-5 w-24 cursor-pointer rounded-md border-4 border-black bg-white px-2 py-2 ease-in-out hover:transition-all md:hover:scale-[1.3]"
                />
              </div>
            </div>
          </div>
          <div className="relative w-full rounded-md">
            <img
              src={InvitedFriends}
              alt="Banner Image"
              className="aspect-auto w-full"
            />
          </div>
          <div className="flex flex-col gap-8">
            <span className="text-xl font-semibold uppercase text-gray300">
              games
            </span>
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="w-6/12">
                <img
                  src={BlackJack}
                  alt="Banner Image"
                  className="aspect-auto w-full"
                />
              </div>
              <div className="w-6/12">
                <img
                  src={HorseRacing}
                  alt="Banner Image"
                  className="aspect-auto w-full"
                />
              </div>
            </div>
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="w-6/12">
                <img
                  src={Roulette}
                  alt="Banner Image"
                  className="aspect-auto w-full"
                />
              </div>
              <div className="w-6/12">
                <img
                  src={Slots}
                  alt="Banner Image"
                  className="aspect-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
