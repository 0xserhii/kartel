"use client"

import { useAppDispatch, useAppSelector } from "@/store/redux";
import { settingsActions } from "@/store/redux/actions";
import { Music, Volume2 } from "lucide-react";

export default function ToggleButton() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector((store: any) => store.settings);

    const handleMusic = () => {
        dispatch(settingsActions.musicPlay(!settings.isMusicPlay));
    };

    const handleSound = () => {
        dispatch(settingsActions.soundPlay(!settings.isSoundPlay));
    };

    return (
        <>
            <div className="flex items-center dark:text-white">
                <div className="relative flex items-center mx-2 shadow-sm rounded-full gap-2 border-2 border-[#4a278da1] bg-transparent hover:bg-transparent">
                    <div className="px-2.5 h-7 bg-transparent rounded-full z-20 flex flex-row justify-between items-center gap-3.5">
                        <Music className={`z-10 w-5 cursor-pointer ${settings.isMusicPlay ? 'text-purple' : "text-white"}`} onClick={handleMusic} />
                        <Volume2 className={`z-10 w-5 cursor-pointer ${settings.isSoundPlay ? 'text-purple' : "text-white"}`} onClick={handleSound} />
                    </div>
                </div>
            </div>
        </>
    )
}