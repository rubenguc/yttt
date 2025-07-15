"use client";
import { Instructions } from "@/components/Instruccions";
import { PoweredBy } from "@/components/PoweredBy";
import { Translation } from "@/components/Translation";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import { VideoForm } from "@/components/VideoForm";
import { VideoPlayerWithSubtitles } from "@/components/VideoPlayer";
import { TRANSCRIPTIONS_STEPS } from "@/constants";
import { VideoInfo } from "@/interfaces/global-interfaces";
import {
  getTranscriptionStatus,
  requestTranscription,
} from "@/server/fetch-xl8-translation";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    title: "",
    thumbnail: "",
    id: "",
    url: "",
  });

  const [step, setStep] = useState("");

  const [requestId, setRequestId] = useState("");
  const [translation, setTranslation] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    if (step !== TRANSCRIPTIONS_STEPS[3]) return;

    const fetchStream = async () => {
      if (requestId) {
        const response = await fetch(`/api/result?request_id=${requestId}`);

        const jsn = await response.json();

        if (jsn.text) {
          setTranslation(jsn.text);

          setStep(TRANSCRIPTIONS_STEPS[4]);
          return;
        } else {
          setError(true);
          setStep("");
          toast.error("An error occurred generating the translation");
        }
      }
    };

    fetchStream();
  }, [requestId, step]);

  const handleVideoInfo = async (videoInfo: VideoInfo) => {
    if (videoInfo.id === "") {
      setError(false);
      setTranslation("");
    }

    // set Video
    setVideoInfo(videoInfo);

    if (!videoInfo.url) {
      // setError("Invalid video URL");
      return;
    }

    setStep(TRANSCRIPTIONS_STEPS[1]);

    // fetch /autotemplate/request
    const { request_id } = await requestTranscription(videoInfo.url);
    setRequestId(request_id);
    setStep(TRANSCRIPTIONS_STEPS[2]);
  };

  useEffect(() => {
    if (step !== TRANSCRIPTIONS_STEPS[2]) return;

    // wait /autotemplate/requests/${id} to finish
    const intervalId = setInterval(async () => {
      if (requestId) {
        const response = await getTranscriptionStatus(requestId);
        if (response.progress === "DONE") {
          setStep(TRANSCRIPTIONS_STEPS[3]);
        } else if (response.error_msg) {
          setError(true);
          toast.error(response.error_msg);
          setStep("");
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, step]);

  const isLoading = step !== TRANSCRIPTIONS_STEPS[4] && step !== "";
  const isCompleted = step === TRANSCRIPTIONS_STEPS[4] && !error;

  const showTranslation = !!translation;

  console.log({
    requestId,
  });

  return (
    <div>
      <div className="mx-auto max-w-2xl mt-20">
        <h2 className="text-center mb-5 text-xl font-bold text-gray-700 max-w-[28ch] mx-auto">
          Generate Subs for non-English Videos powered by AI
        </h2>

        <VideoForm onGetVideoInfo={handleVideoInfo} isLoading={isLoading} />

        {videoInfo.id && (
          <>
            <Separator className="my-10 bg-gray-300" />

            <VideoCard videoInfo={videoInfo} isLoading={false} />

            {!error && (
              <div className="flex items-center gap-2 justify-center">
                <Loader
                  className={`${!isCompleted ? "animate-spin" : "hidden"}`}
                />
                <p
                  className={`${!isCompleted && "animate-pulse"} text-2xl text-center my-10`}
                >
                  {step}
                </p>
              </div>
            )}

            <div className="max-w-2xl mb-10">
              {showTranslation && (
                <Translation
                  isCompleted={isCompleted}
                  translation={translation}
                  error={error}
                  onUpdateTranslation={setTranslation}
                />
              )}
            </div>

            {isCompleted && (
              <VideoPlayerWithSubtitles
                videoUrl={videoInfo.url}
                srtContent={translation}
              />
            )}
          </>
        )}
      </div>
      <Separator className="my-10 bg-gray-300" />
      <Instructions />
      <Separator className="my-10 bg-gray-300" />
      <PoweredBy />
    </div>
  );
}
