import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle
} from 'emoji-picker-react';
import { io, Socket } from 'socket.io-client';
import {
  IChatClientToServerEvents,
  IChatServerToClientEvents,
  Ichat
} from '@/types';

import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Smile, SendHorizonal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import React, { useEffect, useRef, useState } from 'react';
import { getAccessToken } from '@/lib/axios';
import { usePersistStore } from '@/store/persist';
import useToast from '@/routes/hooks/use-toast';

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
};

const HistoryItem = ({ name, message, avatar, time }: HistoryItemProps) => {
  return (
    <div className="flex items-center gap-1 px-3 py-1">
      <div className="relative">
        {/* <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${status === 'online'
              ? 'bg-green'
              : status === 'away'
                ? 'bg-yellow'
                : 'bg-red'
            }`}
        ></span> */}
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#4a278d4f] px-2 py-1">
        <div>
          <span className="text-sm font-medium text-gray300">
            {name ?? 'User:'}
          </span>
          <span className="text-xs font-medium text-gray500"> {time}</span>
        </div>
        <span className="max-w-50 rounded-sm text-[12px] font-medium text-gray200">
          {message}
        </span>
      </div>
    </div>
  );
};

const LiveChat = () => {
  const [inputStr, setInputStr] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [emojiIsOpened, setEmojiIsOpened] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Ichat[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const userData = usePersistStore((store) => store.app.userData);
  const toast = useToast();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const newSocket: Socket<
      IChatServerToClientEvents,
      IChatClientToServerEvents
    > = io(`${SERVER_URL}/chat`);

    newSocket.emit('auth', getAccessToken());

    newSocket.on('message', (message) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    });

    newSocket.on('previous-chat-history', (data) => {
      if (!data.chatHistories.length) {
        console.log(data.message);
      } else {
        setChatHistory((prevChatHistory) => [
          ...data.chatHistories,
          ...prevChatHistory
        ]);
      }
    });

    newSocket.on('disconnect', () => {
      setChatHistory([]);
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('auth', getAccessToken());
    }
  }, [getAccessToken(), socket]);

  const toggleIsOpened = (isOpened: boolean) => {
    setEmojiIsOpened(!isOpened);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setInputStr((prevInput) => prevInput + emojiObject.emoji);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const sendMessage = () => {
    if (!inputStr) return;
    if (userData.username === '') {
      toast.error('Please login to chat');
      return;
    }

    const message = inputStr;
    try {
      socket?.emit('message', message);
      setInputStr('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatHistory.length) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [chatHistory.length]);

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-full w-[278px] flex-col items-stretch gap-0 bg-dark bg-opacity-80">
      <div className="flex items-center gap-3 p-3">
        <span className="text-base font-medium text-gray300">LIVE CHAT</span>
        <div className='w-2 h-2 bg-[#A326D4] rounded-full' style={{
          transform: "scale(1)",
          animation: "2s ease 0s infinite normal none running animation-m10ze4"
        }}></div>
      </div>
      <Separator className="bg-[#4b34a7] bg-opacity-50" />
      <div className="flex flex-1 flex-col items-stretch gap-4">
        {/* <div className="relative">
          <Input
            placeholder="Search"
            className="pl-4 pr-10 min-h-12 border-gray500 text-gray500"
          />
          <span className="absolute top-0 flex items-center justify-center h-full right-4 text-gray500">
            <Search className=" text-gray500" />
          </span>
        </div> */}
        <ScrollArea
          className={`flex flex-col items-stretch py-3 ${emojiIsOpened ? ' max-h-[calc(80vh-300px)]' : ' max-h-[calc(80vh)]'}`}
        >
          {chatHistory.map((chat, key) => (
            <React.Fragment key={key}>
              <HistoryItem
                name={chat.user?.username}
                avatar={chat.user?.avatar}
                time={formatTime(chat.sentAt.toString())}
                message={chat.message}
              />
              <div ref={ref}></div>
            </React.Fragment>
          ))}
        </ScrollArea>
      </div>
      <div className="w-full bg-purple-0.15 px-2 text-gray-400">
        <div className="flex flex-col">
          <div className="flex w-full items-center gap-2">
            <Smile
              className={`cursor-pointer ${emojiIsOpened ? 'text-yellow' : ''}`}
              onClick={() => {
                toggleIsOpened(emojiIsOpened);
              }}
            />
            <Input
              placeholder="Type here"
              className="!focus:ring-0 !focus:ring-offset-0 !focus:ring min-h-10 w-full resize-none overflow-hidden rounded-none !border-none !bg-transparent p-0 text-gray-400 !outline-none !ring-0 !ring-offset-0"
              value={inputStr}
              onChange={(e) => {
                setInputStr(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                  e.preventDefault();
                }
              }}
            />
            <SendHorizonal
              className="hover: cursor-pointer text-blue2"
              onClick={sendMessage}
            />
          </div>
          <div className="flex w-full items-center">
            <EmojiPicker
              height={'300px'}
              width={'100%'}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.GOOGLE}
              previewConfig={{
                defaultEmoji: '',
                defaultCaption: '',
                showPreview: false
              }}
              skinTonesDisabled={true}
              open={emojiIsOpened}
              onEmojiClick={onEmojiClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
