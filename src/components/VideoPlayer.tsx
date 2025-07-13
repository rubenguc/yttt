import { useState, useCallback, useEffect } from "react";
import YouTube from "react-youtube";

function parseTranscript(rawText) {
  const blocks = rawText.trim().split(/\n\s*\n/);
  const results = [];

  for (const block of blocks) {
    const lines = block.split("\n");

    const id = lines[0].trim();
    if (!id.match(/^\d+$/)) continue;

    let timeLine = lines[1];
    if (!timeLine.includes("-->")) {
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].includes("-->")) {
          timeLine = lines[i];
          break;
        }
      }
    }

    const timeMatch = timeLine.match(
      /(\d{2,}:\d{2}:\d{2},\d+|\d{2}:\d{2},\d+)\s*-->\s*(\d{2,}:\d{2}:\d{2},\d+|\d{2}:\d{2},\d+)/,
    );
    if (!timeMatch) continue;

    let [_, startRaw, endRaw] = timeMatch;

    const normalizeTime = (timeStr) => {
      const [before, ms] = timeStr.split(",");
      const parts = before.split(":").map(Number);
      if (parts.length === 2) {
        return `00:${parts[0]}:${parts[1]},${ms}`;
      }
      return `${before},${ms}`;
    };

    const startTime = normalizeTime(startRaw);
    const endTime = normalizeTime(endRaw);

    const toSeconds = (timeStr) => {
      const [before, ms] = timeStr.split(",");
      const [h = 0, m = 0, s = 0] = before.split(":").map(Number);
      return h * 3600 + m * 60 + s + Number(`0.${ms}`) || 0;
    };

    const textLines = lines
      .slice(2)
      .filter((line) => line.trim() !== "" && !line.includes("-->"));
    const text = textLines.join(" ").trim();

    results.push({
      id,
      startTime,
      startSeconds: toSeconds(startTime),
      endTime,
      endSeconds: toSeconds(endTime),
      text,
    });
  }

  return results;
}

export const VideoPlayerWithSubtitles = ({ videoUrl, srtContent }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (srtContent) {
      const parsed = parseTranscript(srtContent.trim());
      setSubtitles(parsed);
    }
  }, [srtContent]);

  const updateSubtitle = useCallback(() => {
    if (!player) return;
    const currentTime = player.getCurrentTime();

    const current = subtitles.find(
      (sub) => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds,
    );

    setCurrentSubtitle(current ? current.text : "");
  }, [player, subtitles]);

  useEffect(() => {
    const interval = setInterval(updateSubtitle, 1000);
    return () => clearInterval(interval);
  }, [updateSubtitle]);

  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  const getYoutubeVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  };

  return (
    <div>
      <h2 className="text-center text-xl mb-4">Preview</h2>
      <YouTube
        videoId={getYoutubeVideoId(videoUrl)}
        opts={{
          height: "360",
          width: "640",
          playerVars: {
            autoplay: 0,
          },
        }}
        onReady={onPlayerReady}
      />
      <div style={{ marginTop: "20px", fontSize: "1.2rem" }}>
        <strong>{currentSubtitle}</strong>
      </div>
    </div>
  );
};
