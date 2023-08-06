"use client";
import { ChatAhrefConstructor } from "@/helpers/chat-ahref-constructor";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import Image from "next/image";

type Props = {
  friends: User[];
  sessionId: string;
};

export default function FriendList({ friends, sessionId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((messages) => !pathname.includes(messages.senderId));
      });
    }
  }, [pathname]);
  return (
    <ul
      role="list"
      className="flex flex-1 max-h-96 overflow-y-auto space-y-1 -mx-2 flex-col gap-y-7"
    >
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
          return unseenMessage.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${ChatAhrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="items-center hover:text-indigo-600 hover:bg-gray-50 w-full group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <span className="group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
                <div className="relative h-6 w-6">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-md group-hover:border group-hover:border-indigo-600"
                    src={friend.image}
                    alt={friend.name || "profile picture"}
                  />
                </div>
              </span>
              <p className="font-semibold truncate hover:text-indigo-600">
                {friend.name}
              </p>
              {unseenMessagesCount > 0 ? (
                <Badge className="group-hover:text-indigo-600 group-hover:border-indigo-600">
                  {unseenMessagesCount}
                </Badge>
              ) : (
                ""
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
