import { NextResponse } from "next/server";
import { getRssFeed } from "~/services/feedService";
import { Quality } from "~/types";

export const revalidate = 10 * 600;

const GET = async (request: Request, { params }: { params: { username: string } }) => {
  try {
    const { username } = params;

    const hostname = request.headers.get("host") ?? "";

    const { searchParams } = new URL(request.url);
    const quality = parseInt(searchParams.get("quality") ?? "") || Quality.Maximum;

    const rssFeed = await getRssFeed(username, hostname, quality);

    return new NextResponse(rssFeed);
  } catch (errorMessage) {
    return new NextResponse((errorMessage as string | undefined) ?? "Unexpected Error", {
      status: 500,
    });
  }
};

export { GET };
