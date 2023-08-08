"use client";

import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="w-full flex flex-col gap-3 p-5">
      <Skeleton className="h-10 w-60" />
      <Skeleton className="h-8 w-96" />
    </div>
  );
}
