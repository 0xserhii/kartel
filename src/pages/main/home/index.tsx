import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import InvitedFriends from '/assets/invitefriends.jpg';
import BlackJack from '/assets/blackjack.jpg';
import BlackJackTitle from '/assets/blackjack-title.png';
import InviteTitle from '/assets/invite-title.png'
import HorseRacing from '/assets/horseracing.jpg';
import HorseRacingTitle from '/assets/horserace-title.png';
import Roulette from '/assets/roulette.jpg';
import RouletteTitle from '/assets/roulette-title.png';
import Slots from '/assets/slots.jpg';
import SlotsTitle from '/assets/slots-title.png';
import Playnow from '/assets/playnow.svg';
import ComingSoonTitle from '/assets/coming-soon.png'

const casinoGameSrc = [
  { name: "crash", bgSrc: "/assets/crash.jpg", titleSrc: "/assets/crash-title.png", href: "/crash" },
  { name: "coinflip", bgSrc: "/assets/coinflip.jpg", titleSrc: "/assets/coinflip-title.png", href: "/coin-flip" },
  { name: "mines", bgSrc: "/assets/mines.jpg", titleSrc: "/assets/mines-title.svg", href: "/mines" }
]

type TCasinoGames = {
  bannerSrc: string;
  titleSrc: string;
  linkTo: string;
  altText: string;
}

const CasinoGames = ({ bannerSrc, titleSrc, linkTo, altText }: TCasinoGames) => {
  return (
    <div className="h-full w-4/12">
      <div className="relative h-full rounded-md">
        <img
          src={bannerSrc}
          alt={altText}
          className="aspect-auto w-full rounded-lg"
        />
        <img
          src={titleSrc}
          alt={altText + "title"}
          className="absolute right-2 top-2 w-24"
        />
        <Link to={linkTo}>
          <img
            src={Playnow}
            alt="Play Now"
            className="absolute bottom-5 left-5 w-24 cursor-pointer rounded-md border-4 border-black bg-white px-2 py-2 ease-in-out hover:transition-all hover:scale-[1.1]"
          />
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex flex-col items-stretch gap-8 p-12">
        <div className="flex flex-col items-stretch gap-6">
          <span className="text-xl font-semibold uppercase text-gray300">
            casino
          </span>
          <div className="flex h-full w-full flex-row justify-between gap-8">
            {
              casinoGameSrc.map((item, index) => {
                return (
                  <CasinoGames key={index} bannerSrc={item.bgSrc} titleSrc={item.titleSrc} linkTo={item.href} altText={item.name} />
                )
              })
            }
          </div>
          <div className="flex h-full w-full flex-row gap-6">
            <div className="relative w-full rounded-md">
              <img
                src={InvitedFriends}
                alt="Banner Image"
                className="aspect-auto w-full rounded-lg"
              />
              <img
                src={InviteTitle}
                alt="title"
                className="absolute bottom-2.5 left-7 w-64 rounded-md cursor-pointer ease-in-out hover:transition-all hover:scale-[1.1]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <span className="text-xl font-semibold uppercase text-gray300">
              games
            </span>
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="relative w-6/12">
                <img
                  src={BlackJack}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <div className='absolute top-5 left-5 flex flex-col gap-2'>
                  <img
                    src={BlackJackTitle}
                    alt="title"
                    className="w-52 rounded-md"
                  />
                  <img
                    src={ComingSoonTitle}
                    alt="title"
                    className="w-36 rounded-md"
                  />
                </div>
              </div>
              <div className="relative w-6/12">
                <img
                  src={HorseRacing}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <div className='absolute top-5 left-5 flex flex-col gap-2'>
                  <img
                    src={HorseRacingTitle}
                    alt="title"
                    className="w-80 rounded-md"
                  />
                  <img
                    src={ComingSoonTitle}
                    alt="title"
                    className="w-36 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="relative w-6/12">
                <img
                  src={Roulette}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <div className='absolute top-5 left-5 flex flex-col gap-2'>
                  <img
                    src={RouletteTitle}
                    alt="title"
                    className="w-52 rounded-md"
                  />
                  <img
                    src={ComingSoonTitle}
                    alt="title"
                    className="w-36 rounded-md"
                  />
                </div>
              </div>
              <div className="relative w-6/12">
                <img
                  src={Slots}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <div className='absolute top-5 left-5 flex flex-col gap-2'>
                  <img
                    src={SlotsTitle}
                    alt="title"
                    className="w-32 rounded-md"
                  />
                  <img
                    src={ComingSoonTitle}
                    alt="title"
                    className="w-36 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
