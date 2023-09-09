import { NextResponse } from 'next/server';
import { getStream } from '~/services/videoService';
import { Quality } from '~/types';

const GET = async (request: Request, { params }: { params: { videoId: string } }) => {
  try {
    const { videoId } = params;

    const { searchParams } = new URL(request.url);
    const quality = parseInt(searchParams.get('quality') ?? '') || Quality.Maximum;

    const m3u8 = await getStream(videoId, quality);

    return new NextResponse(m3u8, {
      headers: { 'Cache-Control': 's-maxage=300', 'Content-Type': 'application/x-mpegURL' },
    });
  } catch (errorMessage) {
    return new NextResponse((errorMessage as string | undefined) ?? 'Unexpected Error', {
      status: 500,
    });
  }
};

export { GET };
