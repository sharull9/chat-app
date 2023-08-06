import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id: idToDeny } = z
      .object({
        id: z.string(),
      })
      .parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    return NextResponse.json({ message: "Remove friend request" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request payload" },
        { status: 422 }
      );
    }
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
