"use client";

import { Button } from "./ui/button";
import { Transition, Dialog } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import FriendList from "./friend-list";
import FriendRequestsOptions from "./friend-requests";
import Image from "next/image";
import ProfileDetails from "./profile-details";
import {
  SidebarOptions,
  sidebarOptions,
} from "@/app/(dashboard)/dashboard/layout";
import { Icons } from "./icons";

type Props = {
  friends: User[];
  session: Session;
  sidebarOptions: SidebarOptions[];
  requestCount: number;
};

export default function Sidebar({
  friends,
  session,
  sidebarOptions,
  requestCount,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="fixed border-b border-zinc-200 top-0 inset-x-0 py-2 px-4">
        <div className="w-full flex justify-between items-center">
          <Link href={"/dashboard"}>SHARULL</Link>
          <Button
            variant={"outline"}
            onClick={() => setOpen(true)}
            className="gap-4"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <div className="fixed inset-0" />
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                      <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-slate-900 py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6">
                              <Link href={"/dashboard"}>SHARULL</Link>
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          {/* Content */}

                          {friends.length > 0 ? (
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                              Your chats
                            </div>
                          ) : null}

                          <nav className="flex flex-1 flex-col min-h-[100%]">
                            <ul
                              role="list"
                              className="flex flex-1 flex-col gap-y-7 min-h-[100%] pb-4"
                            >
                              <li>
                                <FriendList
                                  sessionId={session.user.id}
                                  friends={friends}
                                />
                              </li>
                              <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400">
                                  Overview
                                </div>
                                <ul
                                  role="list"
                                  className="-mx-2 mt-2 space-y-1"
                                >
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
                                          <span className="truncate">
                                            {option.name}
                                          </span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                  <FriendRequestsOptions
                                    sessionId={session.user.id}
                                    initialRequestCount={requestCount}
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
                                      alt={
                                        session?.user.name || "profile picture"
                                      }
                                    />
                                  </div>
                                  <span className="sr-only">Your Profile</span>
                                  <div className="flex flex-col">
                                    <span aria-hidden="true">
                                      {session.user.name}
                                    </span>
                                    <span
                                      className="text-xs text-gray-400"
                                      aria-hidden="true"
                                    >
                                      {session.user.email}
                                    </span>
                                  </div>
                                  <ProfileDetails />
                                </div>
                              </li>
                            </ul>
                          </nav>

                          {/* content end */}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
}
