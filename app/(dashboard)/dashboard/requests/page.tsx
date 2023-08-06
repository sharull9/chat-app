import { FriendsRequest } from "@/components/friend-requests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

type Props = {};

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingRequestSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  const incomingRequestSenderEmails = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingRequestSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderJson = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: senderJson.email,
      };
    })
  );

  console.log(incomingFriendRequests);
  return (
    <main className="p-5 w-full">
      <h1 className="font-bold text-4xl mb-8">Friend Requests</h1>
      <div className="flex flex-col gap-4">
        <FriendsRequest
          incomingFriendRequest={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}
