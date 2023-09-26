import FriendList from "@/components/friend-list";
import FriendRequestsOptions from "@/components/friend-requests";
import { Icon, Icons } from "@/components/icons";
import ProfileDetails from "@/components/profile-details";
import Sidebar from "@/components/sidebar";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { User, getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiOutlineSetting } from "react-icons/ai";

export type SidebarOptions = {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
};

export const sidebarOptions: SidebarOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const initialRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session?.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <div className="w-full flex h-screen flex-col md:flex-row">
      <div className="px-8 pt-4 md:hidden h-[58px]">
        <Sidebar
          sidebarOptions={sidebarOptions}
          session={session}
          requestCount={initialRequestCount}
          friends={friends}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-sm grow flex-col bg-card gap-y-5 p-5 overflow-x-hidden overflow-y-auto border-r border-gray-200">
        <div className="flex justify-between items-center">
          <Link href={"/dashboard"}>SHARULL</Link>
        </div>
        <div className="flex-grow">
          {friends.length > 0 ? (
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your Chats
            </div>
          ) : (
            ""
          )}

          <nav className="flex flex-1 flex-col min-h-[100%]">
            <ul
              role="list"
              className="flex flex-1 flex-col gap-y-7 min-h-[100%] pb-4"
            >
              <li>
                <FriendList sessionId={session.user.id} friends={friends} />
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Overview
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {sidebarOptions.map((option) => {
                    const Icon = Icons[option.Icon];
                    return (
                      <li key={option.id}>
                        <Link
                          href={option.href}
                          className="hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-700 dark:hover:text-indigo-200 w-full group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        >
                          <span className="border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{option.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <FriendRequestsOptions
                    sessionId={session.user.id}
                    initialRequestCount={initialRequestCount}
                  />
                </ul>
              </li>
              <li className="-mx-6 mt-auto flex items-center">
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6">
                  <div className="relative h-8 w-8">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      src={session?.user.image || ""}
                      alt={session?.user.name || "profile picture"}
                    />
                  </div>
                  <span className="sr-only">Your Profile</span>
                  <div className="flex flex-col">
                    <span aria-hidden="true">{session.user.name}</span>
                    <span className="text-xs text-gray-400" aria-hidden="true">
                      {session.user.email}
                    </span>
                  </div>
                  <ProfileDetails />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
