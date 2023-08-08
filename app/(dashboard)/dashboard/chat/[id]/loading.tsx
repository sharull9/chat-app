"use client";
//@ts-nocheck

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="p-5 w-full flex flex-col justify-between flex-1 h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex sm:items-center justify-between pb-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Skeleton className="absolute inset-0 rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col leading-6">
            <div className="text-xl flex items-center">
              <span className="mr-3 font-semibold">
                <Skeleton className="rounded-sm w-24 h-7 mb-2" />
                <Skeleton className="rounded-sm w-40 h-3" />
              </span>
            </div>
            <span className="text-sm text-gray-400">
              <Skeleton className="rounded-sm" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col-reverse gap-4 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-h-2 scrolling-touch">
        <div className="chat-message">
          <div className={cn("flex justify-end items-end")}>
            <div
              className={cn(
                "flex flex-col space-y-2 text-base max-w-xs mx-2 order-1 items-end"
              )}
            >
              <Skeleton className="px-4 py-2 rounded-lg inline-block rounded-br-none w-40 h-10" />
            </div>
            <div className={cn("relative w-6 h-6 order-2")}>
              <Skeleton className="rounded-sm border rounded-e-md rounded-tl-md border-indigo-600 absolute inset-0" />
            </div>
          </div>
          <div className={cn("flex items-end")}>
            <div
              className={cn(
                "flex flex-col space-y-2 text-base max-w-xs mx-2 order-2 items-start"
              )}
            >
              <Skeleton className="px-4 py-2 rounded-lg inline-block rounded-bl-none w-40 h-10" />
            </div>
            <div className={cn("relative w-6 h-6 order-1")}>
              <Skeleton className="rounded-sm border rounded-s-md rounded-tr-md border-gray-600 absolute inset-0" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-0 pt-4 mb-2 sm:mb-0">
        <div className="relative flex-1 rounded-lg shadow-sm z-0">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
