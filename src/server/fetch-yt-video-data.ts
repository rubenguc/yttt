"use server";

import axios from "axios";

export async function fetchVideoData(videoId: string) {
  const response = await axios.get(
    `https://content-youtube.googleapis.com/youtube/v3/videos`,
    {
      params: {
        key: process.env.YT_API_KEY,
        part: "snippet,contentDetails,statistics",
        id: videoId,
      },
    },
  );
  const videoData = response.data?.items?.[0];
  const duration = videoData?.contentDetails?.duration;
  const formattedDuration = convertDurationToHHMM(duration);

  const lng = videoData?.snippet.defaultAudioLanguage;

  return {
    id: videoData?.id,
    title: videoData?.snippet?.title,
    duration: formattedDuration,
    lng,
  };
}

function convertDurationToHHMM(duration: string | undefined): string {
  if (!duration) {
    return "00:00";
  }

  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    return "00:00";
  }

  const hours = parseInt(match[1] || "0", 10) || 0;
  const minutes = parseInt(match[2] || "0", 10) || 0;
  const seconds = parseInt(match[3] || "0", 10) || 0;

  const totalMinutes = hours * 60 + minutes;
  const formattedMinutes = String(totalMinutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
