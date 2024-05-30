import { cn } from "@/lib/utils";
import MovingBackgroundVideo from '../../../../../public/assets/games/crash/moving_background.mp4'
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSpring, animated } from '@react-spring/web';
import { ICrashClientToServerEvents, ICrashServerToClientEvents } from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { CrashHistoryData } from "@/types";



const formatMillisecondsShort = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const shortMilliseconds = Math.floor((ms % 1000) / 10);
    const formattedMilliseconds = shortMilliseconds.toString().padStart(2, '0');
    return `${totalSeconds}:${formattedMilliseconds}`;
}

const GrowingNumber = ({ start, end }) => {
    const { number: numberValue } = useSpring({
        from: { number: start },
        number: end,
        config: { duration: 0.1 },
    });

    return <animated.span>{numberValue.to(n => n.toFixed(2))}</animated.span>;
};


const CrashBoard = () => {
    const crashBgVideoPlayer = useRef<HTMLVideoElement>(null)
    // const [socket, setSocket] = useState<Socket | null>(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [crTick, setCrTick] = useState({ prev: 1, cur: 1 })
    const [prepareTime, setPrepareTime] = useState(0)
    const [crashStatus, setCrashStatus] = useState<ECrashStatus>(ECrashStatus.PREPARE)
    const [downIntervalId, setDownIntervalId] = useState(0)
    const [crashHistoryData, setCrashHistoryData] = useState<CrashHistoryData[]>([]);

    const updatePrepareCountDown = () => {
        setPrepareTime((prev) => prev - 100)
    }

    // const updateCountDown = () => {
    //     setPrepareTime((prev) => prev - 10)
    // }

    const playCrashBgVideo = () => {
        crashBgVideoPlayer?.current?.play()
    }

    const stopCrashBgVideo = () => {
        crashBgVideoPlayer?.current?.pause()
    }


    useEffect(() => {
        const crashSocket: Socket<
            ICrashClientToServerEvents,
            ICrashServerToClientEvents
        > = io(`${SERVER_URL}/crash`);

        crashSocket.emit('previous-crashgame-history', 10 as any);

        crashSocket.on('game-tick', (tick) => {
            setCrashStatus(ECrashStatus.PROGRESS)
            setCrTick(prev => ({
                prev: prev.cur,
                cur: tick
            }))
        })

        crashSocket.on("game-starting", (data) => {
            setCrashStatus(ECrashStatus.PREPARE)
            setPrepareTime(data.timeUntilStart ?? 0)
            stopCrashBgVideo()
        })

        crashSocket.on("game-start", (data) => {
            setCrashStatus(ECrashStatus.PROGRESS)
            setCrTick({ prev: 1, cur: 1 })
            playCrashBgVideo()
        })

        crashSocket.on('previous-crashgame-history', (historyData: any) => {
            setCrashHistoryData(historyData);
            console.log(historyData)
        });


        crashSocket.on("game-end", (data) => {
            setCrashStatus(ECrashStatus.END)
            stopCrashBgVideo()
            crashSocket.emit('previous-crashgame-history', 10 as any);
        })

        // setSocket(crashSocket);

        return () => {
            crashSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (crashStatus === ECrashStatus.PREPARE) {
            const intervalId = window.setInterval(updatePrepareCountDown, 100);
            setDownIntervalId(intervalId)
        } else {
            clearInterval(downIntervalId)
        }
    }, [crashStatus])

    return (
        <div className='relative rounded-md w-full h-[596px]'>
            <video
                className='crash-moving-bg-video rounded-xl object-fill'

                autoPlay
                muted
                ref={crashBgVideoPlayer}
                loop
                controls={false}
                id='crash-moving-bg'
            >
                <source src={MovingBackgroundVideo} type='video/mp4' />
            </video>

            {(crashStatus === ECrashStatus.PROGRESS || crashStatus === ECrashStatus.END) && (
                <div className='flex flex-col absolute top-32 left-10 gap-2 crash-status-shadow'>
                    <div className={cn('text-white text-6xl font-extrabold', crashStatus === ECrashStatus.END && 'crashed-value')}>
                        X<GrowingNumber start={crTick.prev} end={crTick.cur} />
                    </div>
                    <div className='text-[#f5b95a] font-semibold'>
                        {crashStatus === ECrashStatus.PROGRESS ? 'CURRENT PAYOUT' : 'ROUND OVER'}
                    </div>
                </div>
            )}
            {crashStatus === ECrashStatus.PREPARE && prepareTime > 0 && (
                <div className='flex flex-col justify-center items-center absolute top-[40%] left-[20%] gap-5 crash-status-shadow'>
                    <div className='text-white text-xl font-semibold'>
                        PREPARING ROUND
                    </div>
                    <div className=' text-[#f5b95a] text-6xl font-extrabold delay-100'>
                        STARTING IN {formatMillisecondsShort(prepareTime)}
                    </div>
                </div>
            )}
            {
                (crashStatus === ECrashStatus.PROGRESS || crashStatus === ECrashStatus.END) && (
                    <div className='absolute bottom-16 crash-car car-moving'>
                        <img src={crashStatus === ECrashStatus.PROGRESS ? "/assets/games/crash/moving_car.gif" : "/assets/games/crash/explosion.gif"} className={cn(crashStatus === ECrashStatus.PROGRESS ? 'w-64' : "w-96")} alt="crash-car" />
                    </div>
                )

            }
            <div className='flex flex-row justify-around items-center py-5 absolute top-0 left-0 gap-6'>
                <div className='flex flex-row items-center justify-center gap-2'>
                    <span className="inline-flex items-center justify-center w-3 h-3 ms-2 text-xs font-semibold text-blue-800 bg-[#0BA544] rounded-full" />
                    <p className='text-gray-300 text-sm'>Network status</p>
                </div>
                <div className='flex gap-2'>
                    {crashHistoryData?.map((item, index) => (
                        <span
                            key={index}
                            className={cn(
                                'rounded-lg border border-[#1D1776] px-2 text-xs py-1 bg-[#151245] text-gray-300 text-center'
                            )}
                        >
                            x{(item.crashPoint / 100).toFixed(2)}
                        </span>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default CrashBoard