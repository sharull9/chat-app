import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Header from "@/components/header";
import userSession from "@/store/session";

type Props = {};

export default async function page({}: Props) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  // const store = userSession().addToSession(session?.user);
  return <div>{/* <pre>{JSON.stringify(session)}</pre> */}</div>;
}
