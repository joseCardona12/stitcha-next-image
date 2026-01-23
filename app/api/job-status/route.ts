import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ENVS } from "../config/getEnv";
import { NextRequest, NextResponse } from "next/server";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: ENVS.DYNAMO_DB_REGION,
    credentials: {
      accessKeyId: ENVS.ACCESS_KEY,
      secretAccessKey: ENVS.SECRET_ACCESS,
    },
  }),
);

export async function GET(req: NextRequest) {
  const jobId = new URL(req.url).searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const result = await ddb.send(
    new GetCommand({
      TableName: "openai-jobs",
      Key: { jobId },
    }),
  );
  console.log("result", result);

  if (!result.Item) {
    return NextResponse.json({ status: "PROCESSING", imageUrl: "", jobId });
  }

  return NextResponse.json(result.Item);
}
