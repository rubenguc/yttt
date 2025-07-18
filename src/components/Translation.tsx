import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Download, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";

interface TranslationProps {
  isCompleted: boolean;
  translation: string;
  error: boolean;
  onUpdateTranslation: (translation: string) => void;
}

export const Translation = ({
  isCompleted,
  translation,
  error,
  onUpdateTranslation,
}: TranslationProps) => {
  const [cardIsExpanded, setCardIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [translationText, setTranslationText] = useState("");

  useEffect(() => {
    setTranslationText(translation);
  }, [translation]);

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
    downloadFile("transcription.srt", translationText, "application/x-subrip");
  };

  const handleDownloadVTT = () => {
    const lines = translationText.split("\n");

    const vttLines = ["WEBVTT\n"];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect timestamp line and replace ',' with '.'
      if (line.includes("-->")) {
        vttLines.push(line.replace(/,/g, "."));
      } else if (/^\d+$/.test(line)) {
        // Skip sequence number lines (e.g., "1", "2", etc.)
        continue;
      } else {
        vttLines.push(line);
      }
    }

    const vttContent = vttLines.join("\n").trim();

    downloadFile("transcription.vtt", vttContent, "text/vtt");
  };

  const handleUpdate = () => {
    setIsEditing(false);
    onUpdateTranslation(translationText);
  };

  if (error) return null;

  return (
    <div className="slide-up-enter">
      <div className="flex justify-end gap-4 mb-4">
        <Button
          className="cursor-pointer"
          disabled={!isCompleted || error}
          size="sm"
          onClick={handleDownloadSRT}
        >
          <Download />
          <span>Download SRT</span>
        </Button>
        <Button
          className="cursor-pointer"
          disabled={!isCompleted || error}
          size="sm"
          onClick={handleDownloadVTT}
        >
          <Download />
          <span>Download VTT</span>
        </Button>
        <Button
          className="cursor-pointer"
          disabled={!isCompleted || error || !isCompleted}
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
        >
          <Edit />
          <span>Edit</span>
        </Button>
      </div>
      <Card
        className={`flex flex-col max-w-2xl gap-0 overflow-auto  py-0 ${cardIsExpanded ? "h-fit" : "max-h-72"}`}
      >
        <CardHeader className="bg-black text-white relative">
          <h2 className="text-center">Translation:</h2>
          <button className="absolute top-1/2 -translate-y-1/2 right-3 hover:bg-gray-500/40 rounded-full">
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
          {isEditing ? (
            <textarea
              className="w-full h-fit p-2 border rounded bg-white text-black font-mono field-sizing-content"
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
            />
          ) : (
            <code className="whitespace-pre-line">{translationText}</code>
          )}
        </CardContent>
        <CardFooter className="flex justify-end py-3">
          {isEditing && (
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={handleUpdate}>
                Save
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
