import { NextResponse } from "next/server";
import { getStreamUrl } from "~/services/videoService";
import { Quality } from "~/types";

const GET = async (request: Request, { params }: { params: Promise<{ videoId: string }> }) => {
  try {
    const { videoId } = await params;

    const { searchParams } = new URL(request.url);
    const quality = parseInt(searchParams.get("quality") ?? "") || Quality.Maximum;

    return NextResponse.redirect(await getStreamUrl(videoId, quality));
  } catch (errorMessage) {
    return new NextResponse((errorMessage as string | undefined) ?? "Unexpected Error", {
      status: 500,
    });
  }
};

export { GET };
