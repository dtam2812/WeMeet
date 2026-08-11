import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const client = useStreamVideoClient();
  const accessToken = localStorage.getItem("accessToken");
  const user = jwtDecode(accessToken);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user.sub) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.sub },
              { members: { $in: [user.sub] } },
            ],
          },
        });
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.sub]);

  const now = new Date();
  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls.filter(
    ({ state: { startsAt, endedAt } }: Call) => {
      // A call only counts as "upcoming" if it's scheduled in the future
      // AND it hasn't actually been started/ended yet. Without the `!endedAt`
      // check, a meeting started early and ended before its scheduled
      // `startsAt` time would still show up here, since `startsAt` is still
      // in the future relative to `now`.
      return startsAt && new Date(startsAt) > now && !endedAt;
    },
  );

  return {
    endedCalls,
    upcomingCalls,
    recordings: calls,
    isLoading,
  };
};
