import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ENVS } from "../config/getEnv";

const sqs = new SQSClient({
  region: ENVS.SQS_REGION,
  credentials: {
    accessKeyId: ENVS.ACCESS_KEY,
    secretAccessKey: ENVS.SECRET_ACCESS,
  },
});
export async function POST(req: NextRequest) {
  const body = await req.json();
  const jobId = randomUUID();

  try {
    const response = await sqs.send(
      new SendMessageCommand({
        QueueUrl: ENVS.SQS_URL,
        MessageBody: JSON.stringify({
          jobId,
          ...body,
        }),
      }),
    );
    console.log("response", response);
    return NextResponse.json({ jobId });
  } catch (error) {
    return NextResponse.json(
      { message: `Error to send message: ${error}` },
      { status: 500 },
    );
  }
}
