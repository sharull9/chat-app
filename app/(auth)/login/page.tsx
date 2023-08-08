"use client";
import ClientComponents from "@/components/client-components";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineGithub } from "react-icons/ai";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { toast } = useToast();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);
  async function loginGoogle() {
    try {
      setIsLoadingGoogle(true);
      await signIn("google");
      toast({
        description: "Loggin in.....",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Failed...",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  }
  async function loginGithub() {
    try {
      setIsLoadingGithub(true);
      await signIn("github");
      toast({
        description: "Loggin in.....",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Failed...",
      });
    } finally {
      setIsLoadingGithub(false);
    }
  }
  return (
    <div className="min-h-screen">
      <ClientComponents className="w-full min-h-screen">
        <div className="flex flex-col py-20 gap-8 min-h-screen max-w-xl mx-auto items-center justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">SHARULL</CardTitle>
              <CardDescription className="text-center">
                Login into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </ClientComponents>
    </div>
  );
}
