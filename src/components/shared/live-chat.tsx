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
import { useEffect, useRef, useState } from 'react';

export type HistoryItemProps = {
  name: string;
  time: string;
  message: string;
  avatar: string;
};

const HistoryItem = ({ name, message, avatar, time }: HistoryItemProps) => {

  return (
    <div className="flex items-center gap-1 py-1 px-3">
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
      <div className="flex flex-1 flex-col justify-between bg-[#4a278d4f] rounded-lg px-2 py-1">
        <div>
          <span className="text-sm font-medium text-gray300">{name ?? "User:"}</span>
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

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const newSocket: Socket<
      IChatServerToClientEvents,
      IChatClientToServerEvents
    > = io(`${SERVER_URL}/chat`);

    // Listen for 'message' events from the server
    newSocket.on('message', (message) => {
      // Update chat history state to include the new message
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    });

    newSocket.on('previous-chat-history', (data) => {
      console.log('receive_previous_chat', data);
      if (!data.chatHistories.length) {
        console.log(data.message);
      } else {
        setChatHistory((prevChatHistory) => [
          ...data.chatHistories,
          ...prevChatHistory
        ]);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleIsOpened = (isOpened: boolean) => {
    setEmojiIsOpened(!isOpened);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    console.log(emojiObject);
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
    const message = {
      _id: '6654c17632c3ce235eac3795',
      message: inputStr
    };
    console.log(message);
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
        behavior: "smooth",
        block: "end"
      })
    }
  }, [chatHistory.length])

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-full w-[278px] flex-col items-stretch gap-0 bg-dark bg-opacity-80">
      <div className="flex items-center gap-3 p-5">
        <span className="text-base font-medium text-gray300">LIVE CHAT</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink text-[12px] font-medium text-gray200">
          4
        </span>
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
        <ScrollArea className={`flex flex-1 overflow-y-auto flex-col items-stretch ${emojiIsOpened ? " max-h-[calc(80vh-300px)]" : " max-h-[calc(80vh)]"}`}>
          {chatHistory.map((chat, key) => (
            <>
              <HistoryItem
                key={key}
                name={chat.user?.username}
                avatar={chat.user?.avatar}
                time={formatTime(chat.sentAt.toString())}
                message={chat.message}
              />
              <div ref={ref}></div>
            </>
          ))}
        </ScrollArea>
      </div>
      <div className="bg-purple-0.15 text-gray-400 w-full px-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 w-full">
            <Smile
              className={`cursor-pointer ${emojiIsOpened ? 'text-yellow' : ''}`}
              onClick={() => {
                toggleIsOpened(emojiIsOpened);
              }}
            />
            <Input
              placeholder="Type here"
              className="!focus:ring-0 !focus:ring-offset-0 !focus:ring min-h-10 resize-none overflow-hidden rounded-none !border-none !bg-transparent p-0 text-gray-400 !outline-none !ring-0 !ring-offset-0 w-full"
              value={inputStr}
              onChange={(e) => {
                setInputStr(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                  e.preventDefault(); // Prevents the default action of the enter key in a form
                }
              }}
            />
            <SendHorizonal
              className="hover: cursor-pointer text-blue2"
              onClick={sendMessage}
            />
          </div>
          <div className="flex items-center w-full">
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
