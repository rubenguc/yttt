import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { VideoInfo } from "@/interfaces/global-interfaces";
import { CloudDownload, RotateCw } from "lucide-react";
import { fetchVideoData } from "@/server/fetch-yt-video-data";

interface VideoFormProps {
  onGetVideoInfo: (props: VideoInfo) => void;
  isLoading: boolean;
}

export const VideoForm = ({ onGetVideoInfo, isLoading }: VideoFormProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !youtubeUrl.match(
        /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
      )
    ) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    onGetVideoInfo({
      id: "",
      title: "",
      thumbnail: "",
      url: "",
    });

    try {
      const url = new URL(youtubeUrl);

      const videoId = url.searchParams.get("v") as string;
      const { title } = await fetchVideoData(videoId);

      onGetVideoInfo({
        id: videoId,
        title,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        url: youtubeUrl,
      });
    } catch (err) {
      setError("Failed to fetch video information.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-fit mx-auto">
      <div className="mb-3 flex h-13 w-fit relative">
        <Input
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=MyPikw6bzbE"
          disabled={isLoading}
          className="max-w-xl w-md rounded-r-none h-full pr-20 border-black"
        />
        <Button
          disabled={isLoading}
          className="cursor-pointer h-full w-16 absolute top-0 -right-1"
          type="submit"
        >
          {isLoading ? (
            <RotateCw className="animate-spin" />
          ) : (
            <CloudDownload />
          )}
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
