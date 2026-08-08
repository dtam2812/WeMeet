"use client";

import tokenProvider from "@/actions/stream.action";
import Loader from "@/components/Loader";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  imageUrl: string | null;
};

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    const user = jwtDecode<JwtPayload>(accessToken);

    if (!refreshToken || !accessToken) {
      throw new Error("Unauthorized user");
    }
    if (!apiKey) throw new Error("Missing Api key");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl ?? undefined,
      },
      tokenProvider: tokenProvider,
    });

    setVideoClient(client);
  }, []);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
