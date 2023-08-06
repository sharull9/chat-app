"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import React, { useRef, useState } from "react";

type Props = {
  initialMessages: Message[];
  sessionId: string;
};

export default function ChatMessages({ initialMessages, sessionId }: Props) {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  return (
    <div
      id="message"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-h-2 scrolling-touch"
    >
      ChatMessages
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1].senderId === messages[index].senderId;
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
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600": isCurrentUser,
                    "bg-gray-600": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="text-sm ml-2">{message.timestamp}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
