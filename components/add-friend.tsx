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

type FormValues = {
  email: string;
};

export default function AddFriend() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send Request</Button>
      </form>
    </Form>
  );
}
