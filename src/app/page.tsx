"use client";
import { Instructions } from "@/components/Instruccions";
import { PoweredBy } from "@/components/PoweredBy";
import { Translation } from "@/components/Translation";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import { VideoForm } from "@/components/VideoForm";
import { TRANSCRIPTIONS_STEPS } from "@/constants";
import { VideoInfo } from "@/interfaces/global-interfaces";
import {
  getTranscriptionStatus,
  getTranslation,
  requestTranscription,
  requestTranslation,
} from "@/server/fetch-xl8-translation";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    title: "",
    duration: "",
    thumbnail: "",
    id: "",
    lng: "",
    url: "",
  });

  const [step, setStep] = useState(TRANSCRIPTIONS_STEPS[6]);

  const [requestId, setRequestId] = useState("");
  const [translation_request_id, setTranslationRequestId] = useState("");
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    if (step !== TRANSCRIPTIONS_STEPS[2]) return;

    // wait /autotemplate/requests/${id} to finish
    const intervalId = setInterval(async () => {
      if (requestId) {
        const response = await getTranscriptionStatus({ id: requestId });
        if (response.progress === "DONE") {
          setStep(TRANSCRIPTIONS_STEPS[3]);
          const { request_id } = await requestTranslation(
            requestId,
            response.language.split("-")[0],
          );

          setTranslationRequestId(request_id);

          setStep(TRANSCRIPTIONS_STEPS[4]);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, step]);

  useEffect(() => {
    if (step !== TRANSCRIPTIONS_STEPS[4]) return;

    // wait /autotemplate/requests/${id} to finish
    const intervalId = setInterval(async () => {
      if (requestId) {
        const response = await getTranslation(translation_request_id);
        if (response.status === 1) {
          setStep(TRANSCRIPTIONS_STEPS[5]);
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, step]);

  useEffect(() => {
    if (step !== TRANSCRIPTIONS_STEPS[5]) return;

    const fetchStream = async () => {
      if (requestId) {
        const response = await fetch(
          `/api/result?request_id=${translation_request_id}`,
        );

        const reader = response?.body?.getReader();
        console.log("reader");
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader?.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            console.log("chunk: ", chunk);

            const isValidChunk = chunk.startsWith('0:"');

            if (isValidChunk) {
              const value = chunk.split('0:"')[1];
              const cleanedChunk = value.trim().slice(0, -1);

              const formattedChunk = cleanedChunk.replaceAll("\\n", "\n");

              setTranslation((prev) => prev + formattedChunk);
            }
          }
        }

        setStep(TRANSCRIPTIONS_STEPS[6]);
      }
    };

    fetchStream();
  }, [requestId, step]);

  const handleVideoInfo = async (videoInfo: VideoInfo) => {
    // set Video
    setVideoInfo(videoInfo);
    setStep(TRANSCRIPTIONS_STEPS[1]);

    // fetch /autotemplate/request
    const { request_id } = await requestTranscription({ url: videoInfo.url });
    setRequestId(request_id);
    setStep(TRANSCRIPTIONS_STEPS[2]);
  };

  const isLoading = step !== TRANSCRIPTIONS_STEPS[6] && step !== "";
  const isCompleted = step === TRANSCRIPTIONS_STEPS[6];

  console.log("===LOG===", {
    requestId,
    translation_request_id,
    step,
  });
  // console.log();

  return (
    <div>
      <div className="mx-auto max-w-2xl mt-20">
        <h2 className="text-center mb-5 text-xl font-bold text-gray-700">
          Generate English Subs
        </h2>
        <VideoForm onGetVideoInfo={handleVideoInfo} isLoading={isLoading} />

        {videoInfo.id && (
          <>
            <Separator className="my-10 bg-gray-300" />

            <VideoCard videoInfo={videoInfo} isLoading={false} />

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

            <div className=" max-w-2xl ">
              {(step === TRANSCRIPTIONS_STEPS[5] ||
                step === TRANSCRIPTIONS_STEPS[6]) && (
                <Translation
                  isCompleted={isCompleted}
                  translation={translation}
                />
              )}
            </div>
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
