"use client";
import { Check, User, UserPlus, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

type FriendRequestsOptionsProps = {
  initialRequestCount: number;
  sessionId: string;
};

export default function FriendRequestsOptions({
  sessionId,
  initialRequestCount,
}: FriendRequestsOptionsProps) {
  const [requestCount, setRequestCount] = useState<number>(initialRequestCount);

  useEffect(() => {
    const friendRequestHandler = () => {
      setRequestCount((prev) => prev + 1);
    };
    const addedFriendHandler = () => {
      setRequestCount((prev) => prev - 1);
    };

    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
      pusherClient.unbind("new_friend", addedFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href={"/dashboard/requests"}
      className="hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-700 dark:hover:text-indigo-200 w-full group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
        <User className="w-4 h-4" />
      </div>
      <p className="truncate">Friend requests</p>
      {requestCount > 0 ? (
        <Badge className="group-hover:text-indigo-600 group-hover:border-indigo-600">
          {requestCount}
        </Badge>
      ) : (
        ""
      )}
    </Link>
  );
}

type FriendsRequestProps = {
  incomingFriendRequest: IncomingFriendRequest[];
  sessionId: string;
};

export function FriendsRequest({
  incomingFriendRequest,
  sessionId,
}: FriendsRequestProps) {
  const router = useRouter();

  const [friendRequest, setFriendRequest] = useState<IncomingFriendRequest[]>(
    incomingFriendRequest
  );

  useEffect(() => {
    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequest((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", {
      id: senderId,
    });

    setFriendRequest((prev) => prev.filter((req) => req.senderId !== senderId));
    router.refresh();
  };
  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", {
      id: senderId,
    });

    setFriendRequest((prev) => prev.filter((req) => req.senderId !== senderId));
    router.refresh();
  };

  return (
    <>
      {friendRequest?.length == 0 ? (
        <p className="text-sm">Nothing to show here...</p>
      ) : (
        friendRequest.map((request) => {
          return (
            <div key={request.senderId} className="flex gap-4 items-center">
              <UserPlus />
              <p className="font-medium">{request.senderEmail}</p>
              <Button
                aria-label="accept-friend"
                className="grid place-items-center w-8 h-8 transition-all hover:shadow-md"
                variant="outline"
                size="icon"
                onClick={() => acceptFriend(request.senderId)}
              >
                <Check className="font-semibold w-3/4 h-3/4" />
              </Button>
              <Button
                aria-label="reject-friend"
                className="grid place-items-center w-8 h-8 transition-all hover:shadow-md"
                variant="destructive"
                size="icon"
                onClick={() => denyFriend(request.senderId)}
              >
                <X className="font-semibold w-3/4 h-3/4" />
              </Button>
            </div>
          );
        })
      )}
    </>
  );
}
