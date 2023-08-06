import { z } from "zod";

export const addFriendVaidator = z.object({
  email: z.string().email(),
});
