import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <div>
      <button
        onClick={async () => {
          try {
            await call.camera.disable();
            await call.microphone.disable();
          } catch (error) {
            console.error(
              "Failed to disable devices before ending call:",
              error,
            );
          }
          await call.endCall();
          router.push("/");
        }}
        className="bg-red-500 px-2 py-1 rounded-md cursor-pointer font-semibold hover:opacity-70 duration-300"
      >
        End call for everyone
      </button>
    </div>
  );
};

export default EndCallButton;
