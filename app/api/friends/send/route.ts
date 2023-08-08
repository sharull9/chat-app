import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { Message, messageValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { text, id }: { text: string; id: string } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [userId1, userId2] = id.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const friendId = session.user.id == userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];

    const isFriends = friendList.includes(friendId);

    if (!isFriends) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;

    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    pusherServer.trigger(
      toPusherKey(`chat:${id}:messages`),
      "incoming_messages",
      message
    );

    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImage: sender.image,
      senderName: sender.name,
    });
    await db.zadd(`chat:${id}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    return NextResponse.json(
      { message: "Successfully send message." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal server Error." },
      { status: 500 }
    );
  }
}
