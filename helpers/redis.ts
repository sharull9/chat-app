const upstashRedishRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedishRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type commands = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: commands,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedishRestUrl}/${command}/${args.join("/")}`;

  const response = await fetch(`${commandUrl}`, {
    headers: {
      Authorization: `Bearer ${upstashRedishRestToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error executing command: " + response.statusText);
  }

  const data = await response.json();
  return data.result;
}
