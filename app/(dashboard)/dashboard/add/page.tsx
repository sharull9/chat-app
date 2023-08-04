import AddFriend from "@/components/add-friend";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

export default function ({}: Props) {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-4xl mb-8">Add a Friend</h1>
      <AddFriend />
    </main>
  );
}
