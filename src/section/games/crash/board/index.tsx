import { cn } from '@/lib/utils';
import MovingBackgroundVideo from '../../../../../public/assets/games/crash/moving_background.mp4';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSpring, animated } from '@react-spring/web';
import {
  ICrashClientToServerEvents,
  ICrashServerToClientEvents
} from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { CrashHistoryData } from '@/types';

const formatMillisecondsShort = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const shortMilliseconds = Math.floor((ms % 1000) / 10);
  const formattedMilliseconds = shortMilliseconds.toString().padStart(2, '0');
  return `${totalSeconds}:${formattedMilliseconds}`;
};

const GrowingNumber = ({ start, end }) => {
  const { number: numberValue } = useSpring({
    from: { number: start },
    number: end,
    config: { duration: 0.1 }
  });

  return <animated.span>{numberValue.to((n) => n.toFixed(2))}</animated.span>;
};

const CrashBoard = () => {
  const crashBgVideoPlayer = useRef<HTMLVideoElement>(null);
  // const [socket, setSocket] = useState<Socket | null>(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [crTick, setCrTick] = useState({ prev: 1, cur: 1 });
  const [prepareTime, setPrepareTime] = useState(0);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.NONE
  );
  const [downIntervalId, setDownIntervalId] = useState(0);
  const [crashHistoryData, setCrashHistoryData] = useState<CrashHistoryData[]>(
    []
  );

  const updatePrepareCountDown = () => {
    setPrepareTime((prev) => prev - 100);
  };

  const playCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.play();
  };

  const stopCrashBgVideo = () => {
    crashBgVideoPlayer?.current?.pause();
  };

  useEffect(() => {
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(`${SERVER_URL}/crash`);

    crashSocket.emit('previous-crashgame-history', 10 as any);

    crashSocket.on('game-tick', (tick) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick((prev) => ({
        prev: prev.cur,
        cur: tick
      }));
    });

    crashSocket.on('game-starting', (data) => {
      setCrashStatus(ECrashStatus.PREPARE);
      setPrepareTime(data.timeUntilStart ?? 0);
      stopCrashBgVideo();
    });

    crashSocket.on('game-start', (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick({ prev: 1, cur: 1 });
      playCrashBgVideo();
    });

    crashSocket.on('previous-crashgame-history', (historyData: any) => {
      setCrashHistoryData(historyData);
    });

    crashSocket.on('game-end', (data) => {
      setCrashStatus(ECrashStatus.END);
      stopCrashBgVideo();
      crashSocket.emit('previous-crashgame-history', 10 as any);
    });

    // setSocket(crashSocket);

    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      const intervalId = window.setInterval(updatePrepareCountDown, 100);
      setDownIntervalId(intervalId);
    } else {
      clearInterval(downIntervalId);
    }
  }, [crashStatus]);

  return (
    <div className="relative h-[596px] w-full rounded-md">
      <video
        className="crash-moving-bg-video rounded-xl object-fill"
        autoPlay
        muted
        ref={crashBgVideoPlayer}
        loop
        controls={false}
        id="crash-moving-bg"
      >
        <source src={MovingBackgroundVideo} type="video/mp4" />
      </video>

      {(crashStatus === ECrashStatus.PROGRESS ||
        crashStatus === ECrashStatus.END) && (
          <div className="crash-status-shadow absolute left-10 top-32 flex flex-col gap-2">
            <div
              className={cn(
                'text-6xl font-extrabold text-white',
                crashStatus === ECrashStatus.END && 'crashed-value'
              )}
            >
              X<GrowingNumber start={crTick.prev} end={crTick.cur} />
            </div>
            <div className="font-semibold text-[#f5b95a]">
              {crashStatus === ECrashStatus.PROGRESS
                ? 'CURRENT PAYOUT'
                : 'ROUND OVER'}
            </div>
          </div>
        )}
      {crashStatus === ECrashStatus.PREPARE && prepareTime > 0 && (
        <div className="crash-status-shadow absolute left-[20%] top-[40%] flex flex-col items-center justify-center gap-5">
          <div className="text-xl font-semibold uppercase text-white">
            preparing round
          </div>
          <div className="text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
            starting in {formatMillisecondsShort(prepareTime)}
          </div>
        </div>
      )}
      {(crashStatus === ECrashStatus.PROGRESS ||
        crashStatus === ECrashStatus.END) && (
          <div className="crash-car car-moving absolute bottom-16">
            <img
              src={
                crashStatus === ECrashStatus.PROGRESS
                  ? '/assets/games/crash/moving_car.gif'
                  : '/assets/games/crash/explosion.gif'
              }
              className={cn(
                crashStatus === ECrashStatus.PROGRESS ? 'w-64' : 'w-96'
              )}
              alt="crash-car"
            />
          </div>
        )}
      {crashStatus === ECrashStatus.NONE && (
        <div className="crash-status-shadow absolute left-[30%] top-[40%] flex flex-col items-center justify-center gap-5">
          <div className=" text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
            Starting...
          </div>
        </div>
      )}
      <div className="absolute left-0 top-0 flex flex-row items-center justify-around gap-6 py-5">
        <div className="flex flex-row items-center justify-center gap-2">
          <span className="ms-2 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#0BA544] text-xs font-semibold text-blue-800" />
          <p className="text-sm text-gray-300">Network status</p>
        </div>
        <div className="flex gap-2">
          {[...crashHistoryData].reverse()?.map((item, index) => (
            <span
              key={index}
              className={cn(
                'rounded-lg border border-[#1D1776] bg-[#151245] px-2 py-1 text-center text-xs text-gray-300'
              )}
            >
              x{(item.crashPoint / 100).toFixed(2)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrashBoard;
