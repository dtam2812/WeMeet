"use client";

import { useEffect, useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { jwtDecode } from "jwt-decode";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

type value = {
  dateTime: Date;
  description: string;
  link: string;
};

type JwtPayload = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

const MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const [user, setUser] = useState<JwtPayload>();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setUser(jwtDecode<JwtPayload>(accessToken));
    }
  }, []);

  const client = useStreamVideoClient();

  const [meetingValue, setMeetingValue] = useState<value>({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const router = useRouter();

  const createMeeting = async () => {
    if (!client || !user) return;

    if (!meetingValue.dateTime) {
      toast("Please select a date and time");
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        meetingValue.dateTime.toISOString() ||
        new Date(Date.now()).toISOString();
      const description = meetingValue.description || "Instant Meeting";

      call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });

      setCallDetails(call);

      if (!meetingValue.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast.success("Meeting created");
    } catch (error) {
      toast.error("Failed to create meeting");
      console.log(error);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Join via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5 ">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              onChange={(e) =>
                setMeetingValue({
                  ...meetingValue,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={meetingValue.dateTime}
              onChange={(date) =>
                setMeetingValue({ ...meetingValue, dateTime: date! })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none cursor-pointer border"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            /* navigator.clipboard.writeText(meetingLink);
          toast({title:'Linkcopied'}) */
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}
    </section>
  );
};

export default MeetingTypeList;
