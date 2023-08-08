import { ChatAhrefConstructor } from "@/helpers/chat-ahref-constructor";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {};

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithlastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${ChatAhrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      const lastMessage = JSON.parse(lastMessageRaw ? lastMessageRaw : "{}") as
        | Message
        | undefined
        | null;

      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithlastMessage?.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithlastMessage.map((friend) => (
          <>
            <div
              key={friend.id}
              className="relative border border-zinc-100 dark:border-slate-600 p-3 rounded-md"
            >
              <div className="absolute right-4 inset-y-0 flex items-center">
                <ChevronRight className="h-7 w-7" />
              </div>

              <Link
                href={`/dashboard/chat/${ChatAhrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
                className="relative sm:flex"
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                  <div className="relative h-8 w-8">
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-lg"
                      alt={`${friend.name} profile picture`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-400">
                      {friend.lastMessage?.senderId === session.user.id
                        ? "You: "
                        : friend.name + ": "}
                    </span>
                    {friend.lastMessage?.text}
                  </p>
                </div>
              </Link>
            </div>
          </>
        ))
      )}
    </div>
  );
}
