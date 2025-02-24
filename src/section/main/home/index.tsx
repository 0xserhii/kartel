"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import InvitedFriends from "/assets/invitefriends.jpg";
import BlackJack from "/assets/blackjack.jpg";
import BlackJackTitle from "/assets/blackjack-title.png";
import InviteTitle from "/assets/invite-title.png";
import HorseRacing from "/assets/horseracing.jpg";
import HorseRacingTitle from "/assets/horserace-title.png";
import Roulette from "/assets/roulette.jpg";
import RouletteTitle from "/assets/roulette-title.png";
import Slots from "/assets/slots.jpg";
import SlotsTitle from "/assets/slots-title.png";
import Playnow from "/assets/playnow.svg";
import ComingSoonTitle from "/assets/coming-soon.png";
import { casinoGameSrc } from "@/constants/data";

type TCasinoGames = {
  bannerSrc: string;
  titleSrc: string;
  linkTo: string;
  altText: string;
};

const CasinoGames = ({
  bannerSrc,
  titleSrc,
  linkTo,
  altText,
}: TCasinoGames) => {
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
        {linkTo == "/crash" ? (
          <Link to={linkTo}>
            <img
              src={Playnow}
              alt="Play Now"
              className="absolute bottom-5 left-5 w-24 cursor-pointer rounded-md border-4 border-black bg-white px-2 py-2 ease-in-out hover:scale-[1.1] hover:transition-all"
            />
          </Link>
        ) : (
          <img
            src={ComingSoonTitle}
            alt="title"
            className="absolute bottom-5 left-5 w-36 rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default function HomeSection() {
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex flex-col items-stretch gap-8 p-12">
        <div className="flex flex-col items-stretch gap-5">
          <img src="/assets/headings/games.png" alt="games_title" className="w-32" />
          <div className="flex h-full w-full flex-row justify-between gap-8">
            {casinoGameSrc.map((item, index) => {
              return (
                <CasinoGames
                  key={index}
                  bannerSrc={item.bgSrc}
                  titleSrc={item.titleSrc}
                  linkTo={item.href}
                  altText={item.name}
                />
              );
            })}
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
                className="absolute bottom-2.5 left-7 w-64 cursor-pointer rounded-md ease-in-out hover:scale-[1.1] hover:transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <img src="/assets/headings/casino.png" alt="casino_title" className="w-32" />
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="relative w-6/12">
                <img
                  src={BlackJack}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={BlackJackTitle}
                  alt="title"
                  className="absolute right-5 top-5 w-48 rounded-md"
                />
                <img
                  src={ComingSoonTitle}
                  alt="title"
                  className="absolute bottom-5 left-5 w-36 rounded-md"
                />
              </div>
              <div className="relative w-6/12">
                <img
                  src={HorseRacing}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={HorseRacingTitle}
                  alt="title"
                  className="absolute right-5 top-5 w-80 rounded-md"
                />
                <img
                  src={ComingSoonTitle}
                  alt="title"
                  className="absolute bottom-5 left-5 w-36 rounded-md"
                />
              </div>
            </div>
            <div className="flex h-full w-full flex-row justify-between gap-6">
              <div className="relative w-6/12">
                <img
                  src={Roulette}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={RouletteTitle}
                  alt="title"
                  className="absolute right-5 top-5 w-48 rounded-md"
                />
                <img
                  src={ComingSoonTitle}
                  alt="title"
                  className="absolute bottom-5 left-5 w-36 rounded-md"
                />
              </div>
              <div className="relative w-6/12">
                <img
                  src={Slots}
                  alt="Banner Image"
                  className="aspect-auto w-full rounded-lg"
                />
                <img
                  src={SlotsTitle}
                  alt="title"
                  className="absolute right-5 top-5 w-28 rounded-md"
                />
                <img
                  src={ComingSoonTitle}
                  alt="title"
                  className="absolute bottom-5 left-5 w-36 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
