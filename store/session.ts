import { create } from "zustand";

type UserSession = {
  user: User;
  addToSession: () => void;
};

const userSession = create<UserSession>((set) => ({
  user: {
    email: "",
    id: "",
    image: "",
    name: "",
  },
  //@ts-ignore
  addToSession: (session: User) =>
    set({
      user: {
        email: session.email,
        id: session.id,
        image: session.image,
        name: session.name,
      },
    }),
}));

export default userSession;
