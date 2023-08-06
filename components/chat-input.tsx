"use client";
import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { text } from "stream/consumers";

type Props = { chatPartner: User };

export default function ChatInput({ chatPartner }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {};

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-indigo-600">
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
          className="block w-full resize-none border-0 bg-transparent placeholder:text-gray-400 focus:ring-0 sm:leading-6"
        />
        <div className="absolute right-0 bottom-0 top-0">
          <Button
            onClick={() => {
              textareaRef.current?.focus();
            }}
            aria-hidden="true"
            variant={"outline"}
          >
            Send
          </Button>
        </div>
      </div>
      ChatInput
    </div>
  );
}
