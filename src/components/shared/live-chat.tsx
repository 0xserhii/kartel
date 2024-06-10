import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle
} from 'emoji-picker-react';

import { Separator } from '../ui/separator';
import { Smile, SendHorizonal } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import React, { useEffect, useRef, useState } from 'react';
import { usePersistStore } from '@/store/zustand/persist';
import useToast from '@/routes/hooks/use-toast';
import { Input } from '../ui/input';
import { chatActions } from '@/store/redux/actions';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { getAccessToken } from '@/lib/axios';
import { useInView } from 'react-intersection-observer';

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
      </div>
      <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#4a278d4f] px-2 py-1">
        <div>
          <span className="text-sm font-medium text-gray300">
            {name ?? 'User:'}
          </span>
          <span className="text-xs font-medium text-gray500"> {time}</span>
        </div>
        <div className="max-w-[234px] rounded-sm text-[12px] font-medium text-gray200">
          {message}
        </div>
      </div>
    </div>
  );
};

const LiveChat = () => {
  const [inputStr, setInputStr] = useState('');
  const [emojiIsOpened, setEmojiIsOpened] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const userData = usePersistStore((store) => store.app.userData);
  const { ref: lastMessageRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });
  const toast = useToast();
  const chatState = useAppSelector((state) => state.chat);
  const firstChatSentAt = chatState?.chatHistory?.length > 0 ? chatState.chatHistory[0].sentAt : null;
  const dispatch = useAppDispatch();
  const toggleIsOpened = (isOpened: boolean) => {
    setEmojiIsOpened(!isOpened);
  };
  const [status, setStatus] = useState(false);

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
      dispatch(chatActions.sendMsg(message))
      setInputStr('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setStatus(true);
  }, [])

  useEffect(() => {
    dispatch(chatActions.loginChatServer())
  }, [getAccessToken()]);

  useEffect(() => {
    if (status) {
      dispatch(chatActions.subscribeChatServer());
    }
  }, [status]);

  useEffect(() => {
    if ((chatState?.chatHistory && Array.isArray(chatState?.chatHistory)) && chatState?.chatHistory.length) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [chatState?.chatHistory]);

  useEffect(() => {
    if (inView && status) {
      dispatch(chatActions.getChatHistory(firstChatSentAt));
    }
  }, [inView]);

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-full w-[278px] flex-col items-stretch gap-0 bg-dark bg-opacity-80">
      <div className="flex items-center gap-3 p-3">
        <span className="text-base font-medium text-gray300">LIVE CHAT</span>
        <div
          className="h-2 w-2 rounded-full bg-purple"
          style={{
            transform: 'scale(1)',
            animation:
              '2s ease 0s infinite normal none running animation-bubble'
          }}
        ></div>
      </div>
      <Separator className="bg-[#4b34a7] bg-opacity-50" />
      <div className="flex flex-1 flex-col items-stretch gap-4">
        <ScrollArea
          className={`flex flex-col items-stretch py-3 ${emojiIsOpened ? ' max-h-[calc(80vh-300px)]' : ' max-h-[calc(80vh)]'}`}
        >
          <div ref={lastMessageRef}></div>
          {(chatState?.chatHistory && Array.isArray(chatState?.chatHistory)) && chatState?.chatHistory?.map((chat, key) => (
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
        <div className="flex h-full flex-col">
          <div className="flex h-full w-full items-center gap-2">
            <Smile
              className={`cursor-pointer ${emojiIsOpened ? 'text-yellow' : ''}`}
              onClick={() => {
                toggleIsOpened(emojiIsOpened);
              }}
            />
            <Input
              className="!focus:ring-0 !focus:ring-offset-0 !focus:ring w-full resize-none overflow-hidden rounded-none !border-none !bg-transparent p-0 text-gray-400 !outline-none !ring-0 !ring-offset-0"
              value={inputStr}
              onChange={(e) => {
                setInputStr(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
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
    </div >
  );
};

export default LiveChat;