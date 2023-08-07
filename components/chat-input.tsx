"use client";
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "./ui/use-toast";

type Props = { chatPartner: User; id: string };

export default function ChatInput({ chatPartner, id }: Props) {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    setIsLoading(true);

    try {
      await axios.post("/api/friends/send", {
        text: input,
        id,
      });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-0 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 rounded-lg shadow-sm z-0">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none p-3 border-0 rounded-lg bg-transparent placeholder:text-gray-400 focus:ring-0 sm:leading-6 ring-2 ring-inset focus-within:ring-2 focus-within:ring-indigo-600"
        />
        {/* <div className="py-2" onClick={() => textareaRef.current?.focus()}>
          <div className="py-8">
            <div className="h-9"></div>
          </div>
        </div> */}
        <div className="absolute right-1 bottom-1 top-1">
          <Button onClick={sendMessage} aria-hidden="true" variant={"outline"}>
            Send
            {isLoading ? (
              <Loader2 className="ml-1 h-4 w-4 animate-spin" />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
}
