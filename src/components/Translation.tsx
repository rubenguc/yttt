import { useToggle } from "react-use";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useState } from "react";

interface TranslationProps {
  isCompleted: boolean;
  translation: string;
}

export const Translation = ({ isCompleted, translation }: TranslationProps) => {
  const [cardIsExpanded, setCardIsExpanded] = useState(false);

  function downloadFile(filename, content, contentType = "text/plain") {
    const element = document.createElement("a");
    const blob = new Blob([content], { type: contentType });
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(blob);
  }

  const handleDownloadSRT = () => {
    downloadFile("transcription.srt", translation, "application/x-subrip");
  };

  const handleDownloadVTT = () => {
    const lines = translation.split(/\r?\n/);
    const processedLines = lines.map((line) => {
      const timestampRegex =
        /^(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})$/;
      console.log(timestampRegex.test(line.trim()));
      if (timestampRegex.test(line.trim())) {
        return line.replace(/,/g, ".");
      }
      return line;
    });

    const vttContent = "WEBVTT\n\n" + processedLines.join("\n");
    downloadFile("transcription.vtt", vttContent, "text/vtt");
  };

  return (
    <div className="slide-up-enter">
      <div className="flex justify-end gap-4 mb-4">
        <Button disabled={!isCompleted} size="sm" onClick={handleDownloadSRT}>
          <Download />
          <span>Download SRT</span>
        </Button>
        <Button disabled={!isCompleted} size="sm" onClick={handleDownloadVTT}>
          <Download />
          <span>Download VTT</span>
        </Button>
      </div>
      <Card
        className={`flex flex-col max-w-2xl gap-0 overflow-auto  py-0 ${cardIsExpanded ? "h-fit" : "max-h-72"}`}
      >
        <CardHeader className="bg-black text-white relative">
          <h2 className="text-center">Translation:</h2>
          <button className="absolute top-1/2 -translate-y-1/2 right-3 hover:bg-red-500 rounded-full">
            {cardIsExpanded ? (
              <ChevronUp
                color="white"
                size={20}
                onClick={() => setCardIsExpanded(false)}
              >
                Collapse
              </ChevronUp>
            ) : (
              <ChevronDown
                color="white"
                size={20}
                onClick={() => setCardIsExpanded(true)}
              >
                Expand
              </ChevronDown>
            )}
          </button>
        </CardHeader>
        <CardContent className="overflow-auto pt-0 pb-5">
          <code className="whitespace-pre-line">{translation}</code>
        </CardContent>
      </Card>
    </div>
  );
};
