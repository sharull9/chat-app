"use client";
import ClientComponents from "@/components/client-components";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineGithub } from "react-icons/ai";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

type Props = {};

export default function page({}: Props) {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);
  async function loginGoogle() {
    try {
      setIsLoadingGoogle(true);
      await signIn("google");
      toast.success("Loged in successfully");
    } catch (e) {
      toast.error("failed");
    } finally {
      setIsLoadingGoogle(false);
    }
  }
  async function loginGithub() {
    try {
      setIsLoadingGithub(true);
      await signIn("github");
      toast.success("Loged in successfully");
    } catch (e) {
      toast.error("failed");
    } finally {
      setIsLoadingGithub(false);
    }
  }
  return (
    <div>
      <ClientComponents>
        <div className="flex flex-col py-20 gap-8 min-h-full max-w-xl mx-auto items-center justify-center">
          <div>
            <p className="text-3xl">SHARULL</p>
          </div>
          <div>
            <h1 className="text-2xl">Login into your account</h1>
          </div>
          <Button
            className="w-full"
            onClick={loginGoogle}
            type="button"
            disabled={isLoadingGoogle}
          >
            {isLoadingGoogle ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle />
            )}
            &nbsp;Google
          </Button>
          <Button
            className="w-full"
            onClick={loginGithub}
            type="button"
            disabled={isLoadingGithub}
          >
            {isLoadingGithub ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <AiOutlineGithub />
            )}
            &nbsp;Github
          </Button>
        </div>
      </ClientComponents>
    </div>
  );
}
