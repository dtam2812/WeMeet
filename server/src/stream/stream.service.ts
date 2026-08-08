import { Injectable } from '@nestjs/common';
import { StreamClient } from '@stream-io/node-sdk';

@Injectable()
export class StreamService {
  private client = new StreamClient(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!,
  );

  genarateUserToken(userId: string) {
    return this.client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60,
    });
  }
}
