"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-4xl">Not Found</h2>
        <p>There is some error. Try login in again after logging out.</p>
        <Button onClick={() => signOut()}>Log out</Button>
        <Link href="/"></Link>
      </div>
    </div>
  );
}
