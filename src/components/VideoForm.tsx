import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchVideoData } from "@/server/fetch-yt-video-data";
import { VideoInfo } from "@/interfaces/global-interfaces";
import { CloudDownload, RotateCw } from "lucide-react";

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
      duration: "",
      lng: "",
      thumbnail: "",
      url: "",
    });

    try {
      const videoId = youtubeUrl.split("v=")[1];
      const response = await fetchVideoData(videoId);

      onGetVideoInfo({
        id: videoId,
        title: response.title,
        duration: response.duration,
        lng: response.lng,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
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
          className="max-w-xl w-md rounded-r-none h-full pr-20"
        />
        <Button
          disabled={isLoading}
          className="cursor-pointer h-full w-16 absolute top-0 right-0"
          type="submit"
        >
          {isLoading ? (
            <RotateCw className="animate-spin" size="xl" />
          ) : (
            <CloudDownload size="xl" />
          )}
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
