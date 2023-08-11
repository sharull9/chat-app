"use client";
import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

type Props = {
  initialMessages: Message[];
  userId: string | null | undefined;
  userImage: string | null | undefined;
  chatPartner: User;
  id: string;
};

export default function ChatMessages({
  initialMessages,
  userId,
  userImage,
  chatPartner,
  id,
}: Props) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const formatTimeStamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  useEffect(() => {
    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.subscribe(toPusherKey(`chat:${id}:messages`));

    pusherClient.bind("incoming_messages", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${id}:messages`));
      pusherClient.unbind("incoming_messages", messageHandler);
    };
  }, [id]);
  return (
    <div
      id="message"
      className="flex md:hidden h-full flex-1 flex-col-reverse gap-4 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-h-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === userId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId == messages[index].senderId;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 rounded-lg text-white inline-block",
                    {
                      "bg-indigo-600": isCurrentUser,
                      "bg-gray-600": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    }
                  )}
                >
                  {message.text}{" "}
                  <span className="text-sm ml-2">
                    {formatTimeStamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (userImage as string) : chatPartner.image
                  }
                  className={cn("border", {
                    "rounded-e-md rounded-tl-md border-indigo-600":
                      isCurrentUser,
                    "rounded-s-md rounded-tr-md border-gray-600":
                      !isCurrentUser,
                  })}
                  alt={`profile picture`}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
