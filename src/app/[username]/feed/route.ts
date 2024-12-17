import { NextResponse } from "next/server";
import { getRssFeed } from "~/services/feedService";
import { Quality } from "~/types";

const GET = async (request: Request, { params }: { params: { username: string } }) => {
  try {
    const { username } = params;

    const hostname = request.headers.get("host") ?? "";

    const { searchParams } = new URL(request.url);
    const quality = parseInt(searchParams.get("quality") ?? "") || Quality.Maximum;

    const rssFeed = await getRssFeed(username, hostname, quality);

    return new NextResponse(rssFeed, { headers: { "Cache-Control": "s-maxage=900" } });
  } catch (error) {
    if (typeof error === "string" && error.toLowerCase().includes("not found"))
      return new NextResponse(error, { status: 404 });

    console.error(error);

    return new NextResponse(typeof error === "string" ? error : "Unexpected Error", {
      status: 500,
    });
  }
};

export { GET };
