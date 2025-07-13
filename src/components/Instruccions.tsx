import { ClipboardPaste, CloudDownload, Download } from "lucide-react";

const STEPS = [
  {
    id: 1,
    icon: ClipboardPaste,
    title: "Paste URL",
    description:
      "Copy and paste the YouTube URL you want to generate subtitles for",
  },
  {
    id: 2,
    icon: CloudDownload,
    title: "Generate",
    description: "Wait for the subtitles to be generated with AI",
  },
  {
    id: 3,
    icon: Download,
    title: "Download",
    description: "Download the .srt or .vtt file",
  },
];

export const Instructions = () => {
  return (
    <section>
      <h2 className="text-center text-2xl font-semibold mb-14">
        How to use it?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 items-baseline gap-20 flex-wrap mx-auto w-fit">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <step.icon className="w-10 h-10 text-gray-600 mb-2" />
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-gray-600 text-xs w-[20ch]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
