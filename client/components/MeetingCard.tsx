"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  attendees?: string[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
];

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  attendees = [],
}: MeetingCardProps) => {
  const visibleAttendees = attendees.slice(0, 4);
  const remainingCount = attendees.length - visibleAttendees.length;

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        {visibleAttendees.length > 0 && (
          <div className="relative flex w-full max-sm:hidden">
            {visibleAttendees.map((name, index) => (
              <div
                key={index}
                className={cn(
                  "flex-center size-10 rounded-full border-[3px] border-dark-1 text-xs font-semibold text-white",
                  avatarColors[index % avatarColors.length],
                  { absolute: index > 0 },
                )}
                style={{ top: 0, left: index * 28 }}
              >
                {getInitials(name)}
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                className="flex-center absolute size-10 rounded-full border-[5px] border-dark-3 bg-dark-4 text-sm"
                style={{ left: visibleAttendees.length * 28 }}
              >
                +{remainingCount}
              </div>
            )}
          </div>
        )}
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Link Copied");
              }}
              className="bg-dark-4 px-6"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
