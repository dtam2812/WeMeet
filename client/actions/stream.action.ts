import { jwtDecode } from "jwt-decode";
import { StreamClient } from "@stream-io/node-sdk";
import { api } from "@/common";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

const tokenProvider = async () => {
  const response = await api.get("/stream/token");
  return response.data.token;
};

export default tokenProvider;
