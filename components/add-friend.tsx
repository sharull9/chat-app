"use client";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { addFriendVaidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

type FormValues = z.infer<typeof addFriendVaidator>;

export default function AddFriend() {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(addFriendVaidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendVaidator.parse({ email });
      await axios.post("/api/friends/add", {
        validatedEmail,
      });
      toast({
        description: "Friend request sent!",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          description: err.message,
        });
        return form.setError("email", { message: err.message });
      }
      if (err instanceof AxiosError) {
        toast({
          description: err.response?.data.message,
        });
        return form.setError("email", { message: err.response?.data.message });
      }
      toast({
        description: "Something went wrong",
      });
      form.setError("email", { message: "Something went wrong" });
    }
  };
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addFriend(data.email);
  };
  return (
    <Form {...form}>
      <form
        action=""
        className="flex gap-3 max-w-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  placeholder="Email Address"
                  required
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter email address of your friend.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Send Request</Button>
      </form>
    </Form>
  );
}
