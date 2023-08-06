import { fetchRedis } from "./redis";

export async function getFriendsByUserId(id: string) {
  const friendsIds = (await fetchRedis(
    "smembers",
    `user:${id}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendsIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
}
