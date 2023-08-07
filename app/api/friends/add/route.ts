import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendVaidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: string = body.validatedEmail.email;
    const { email: emailToAdd } = addFriendVaidator.parse({ email });
    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;
    if (!idToAdd) {
      return NextResponse.json(
        { message: "This person does not exit." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (idToAdd == session.user.id) {
      return NextResponse.json(
        { message: "You cannot add yourself as a friend." },
        { status: 400 }
      );
    }

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return NextResponse.json(
        { message: "Already added this user." },
        { status: 400 }
      );
    }

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return NextResponse.json(
        { message: "Already friends." },
        { status: 400 }
      );
    }


    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return NextResponse.json({ status: "good" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request payload" },
        { status: 422 }
      );
    }
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
