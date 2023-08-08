"use client";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="w-full flex flex-col gap-3 p-5">
      <Skeleton className="h-20 w-72 mb-5" />
      <Skeleton className="h-10 w-60" />
      <Skeleton className="h-3 w-[450px]" />
      <Skeleton className="h-3 w-[450px]" />
      <Skeleton className="h-3 w-[450px]" />
    </div>
  );
}
