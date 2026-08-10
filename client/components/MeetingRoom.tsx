import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndent } from "@fortawesome/free-solid-svg-icons";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)]  ml-2", {
            hidden: !showParticipants,
            block: showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap pb-2">
        <CallControls />

        <DropdownMenu>
          <DropdownMenuTrigger className="text-lg cursor-pointer px-2 py-1 rounded-2xl bg-[#19232d] hover:bg-[#4c535b]">
            <FontAwesomeIcon icon={faIndent} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {["Grid", "Speakerl-Left", "Speaker-Right"].map(
                (element, index) => {
                  return (
                    <DropdownMenuItem
                      key={index}
                      className="cursor-pointer"
                      onClick={() =>
                        setLayout(element.toLowerCase() as CallLayoutType)
                      }
                    >
                      {element}
                    </DropdownMenuItem>
                  );
                },
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants(!showParticipants)}>
          <div className="cursor-pointer rounded-2xl px-4 py-2 bg-[#19232d] hover:bg-[#4c535b]">
            <User size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
