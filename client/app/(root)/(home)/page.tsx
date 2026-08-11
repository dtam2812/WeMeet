"use client";

import { useEffect, useMemo, useState } from "react";
import MeetingTypeList from "@/components/MeetingTypeList";
import { useGetCalls } from "@/hooks/useGetCalls";

const Home = () => {
  const [now, setNow] = useState(new Date());
  const { upcomingCalls, isLoading } = useGetCalls();

  // Keep the clock/date on the banner ticking instead of freezing at
  // the time the page first rendered.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString("en-vn", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-vn", { dateStyle: "full" }).format(
    now,
  );

  // Pick the soonest upcoming meeting out of everything useGetCalls returns.
  const nextMeeting = useMemo(() => {
    return [...upcomingCalls]
      .filter((call) => call.state.startsAt)
      .sort(
        (a, b) =>
          new Date(a.state.startsAt as Date).getTime() -
          new Date(b.state.startsAt as Date).getTime(),
      )[0];
  }, [upcomingCalls]);

  const upcomingLabel = isLoading
    ? "Loading..."
    : nextMeeting
      ? `Upcoming meeting at: ${new Date(
          nextMeeting.state.startsAt as Date,
        ).toLocaleTimeString("en-vn", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "No upcoming meeting";

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 max-lg:px-5 max-lg:py-8  lg:p-11">
          <h2 className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl max-w-[270px] rounded py-2 text-center text-base font-normal">
            {upcomingLabel}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
