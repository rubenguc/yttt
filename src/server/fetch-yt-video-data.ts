import axios from "axios";

export async function fetchVideoData(videoId: string) {
  const thumbnail = `https://img.youtube.com/vi/${videoId}/default.jpg`;

  const response = await axios("https://www.youtube.com/oembed", {
    params: {
      format: "json",
      url: `https://www.youtube.com/watch?v=${videoId}`,
    },
  });

  const title = response.data.title;

  return {
    thumbnail,
    id: videoId,
    title: title,
  };
}
