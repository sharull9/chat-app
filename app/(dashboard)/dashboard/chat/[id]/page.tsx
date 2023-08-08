import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-message";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

async function getChatMessage(id: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${id}:messages`,
      0,
      -1
    );

    const dbMessage = result.map((message) => JSON.parse(message) as Message);

    const reverseDbMessage = dbMessage.reverse();

    const messages = messageArrayValidator.parse(reverseDbMessage);

    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function page({ params }: Props) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = id.split("--");

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  const initialMessages = await getChatMessage(id);

  return (
    <div className="p-5 w-full flex flex-col justify-between flex-1 h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex sm:items-center justify-between pb-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Image
                fill
                src={chatPartner.image}
                referrerPolicy="no-referrer"
                alt={`${chatPartner.name} profile picture`}
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col leading-6">
            <div className="text-xl flex items-center">
              <span className="mr-3 font-semibold">{chatPartner.name}</span>
            </div>
            <span className="text-sm text-gray-400">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <ChatMessages
        userId={session?.user?.id}
        userImage={session?.user?.image}
        chatPartner={chatPartner}
        initialMessages={initialMessages}
        id={id}
      />
      <ChatInput id={id} chatPartner={chatPartner} />
    </div>
  );
}
