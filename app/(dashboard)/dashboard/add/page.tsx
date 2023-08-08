import AddFriend from "@/components/add-friend";
import React from "react";

type Props = {};

export default function ({}: Props) {
  return (
    <main className="p-5 w-full">
      <h1 className="font-bold text-4xl mb-8">Add a Friend</h1>
      <AddFriend />
    </main>
  );
}
