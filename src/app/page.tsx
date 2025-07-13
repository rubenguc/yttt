"use client";
import { Instructions } from "@/components/Instruccions";
import { PoweredBy } from "@/components/PoweredBy";
import { Translation } from "@/components/Translation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import { VideoForm } from "@/components/VideoForm";
import { TRANSCRIPTIONS_STEPS } from "@/constants";
import { VideoInfo } from "@/interfaces/global-interfaces";
import {
  getTranscriptionStatus,
  getTranslationStatus,
  requestTranscription,
  requestTranslation,
} from "@/server/fetch-xl8-translation";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [translation, setTranslation] = useState(`
    1
    00:00:00,079 --> 00:00:02,497
    그냥 경찰에 신고하면 돼요. 법이 해결해야죠.

    2
    00:00:02,581 --> 00:00:07,407
    잘못한 거 있으면 그 사람이 죗값을 받아야죠. 열 받는다. 진짜 열 받는다.

    3
    00:00:07,491 --> 00:00:09,699
    고발해야 돼. 그 전화번호 해서 고발해야겠다.

    4
    00:00:12,340 --> 00:00:17,798
    일단 지금 가져오신 게 컴퓨터 안에 부품들을 지금 다 안 넣어서 가져오셨는데

    5
    00:00:17,921 --> 00:00:22,157
    어쩌다가 지금 이게 다 빠져있는 거예요? 처음에 컴퓨터가 불도

    6
    00:00:22,281 --> 00:00:26,277
    들어오고 다 돌아가는데 모니터가 안 켜져 가지고 회사를 처음 한

    7
    00:00:26,401 --> 00:00:30,807
    분을 불렀는데 이지보드에 씨피유 빨간 불빛 띤다고 씨피유가 문제라고.

    8
    00:00:30,891 --> 00:00:34,117
    쿨러가 나갔다고 아예. 그래서 씨피유 쿨러가 실제로 안 돌아가더라고요.

    9
    00:00:34,281 --> 00:00:36,768
    그게 문제라고 해서 새로 부품을 교체하려고

    10
    00:00:36,852 --> 00:00:40,157
    고려를 하고 있었는데 수리비를 세게 불러서 다른 사람을 불렀거든요,

    11
    00:00:40,261 --> 00:00:46,738
    출장을. 네. 불렀는데 이제 처음에 확인해 보고 씨피유가 문제가 맞대요.
    근데 씨피유는 버리는 걸로 하고 뗐고,

    12
    00:00:46,821 --> 00:00:50,197
    그분이 가져가서 씨피유를 새로 비슷한 거 중에 가성비 좋은 게

    13
    00:00:50,301 --> 00:00:54,068
    뭐 있냐 여쭤봐서 오천육백 엑스를 새 제품으로 바꿔주긴 했는데

    14
    00:00:54,151 --> 00:00:57,238
    문자를 주시는 게 그래픽카드도 문제가 있다. 그래픽카드까지도

    15
    00:00:57,322 --> 00:01:02,867
    바꾸셔야 될 것 같다. 이 두 개가 사실 동시에 나가는 게 상식적이지
    않잖아요. 이게 말이 안 된다고 생각을 해서 저희가 그때 그냥

    16
    00:01:02,951 --> 00:01:06,317
    그 씨피유도 없이 안 바꾸겠다 하고서는 지금 뗀 상태로 또 점검

    17
    00:01:06,421 --> 00:01:09,457
    받으러 온 거거든요. 전부 다. 탈거하신 부품들 가져오셨어요?

    18
    00:01:09,601 --> 00:01:13,517
    아니 씨피유랑 그런 것들은 망가졌다고 생각하고 집에 아예 데리고 왔습니다.

    19
    00:01:13,641 --> 00:01:16,377
    본인이 가져가서 하고 가지고 오겠다고 하는 거예요. 근데

    20
    00:01:16,501 --> 00:01:20,477
    저희는 어쩔 수 없잖아요. 그래야지 다음날 볼 수 있다고 하니까.

    21
    00:01:20,561 --> 00:01:23,937
    그리고 나서 저녁이 돼서 언제 오시나요?라고 문자를 했더니

    22
    00:01:24,041 --> 00:01:28,007
    갑자기 씨피유는 새 걸로 끼워서 정상인데 그래픽이 나갔다는 거예요,

    23
    00:01:28,091 --> 00:01:33,057
    그래픽. 그래픽카드 인식 불가능.
    그래픽카드 빼고도 이 사진 찍으면 이렇게 나와요. 그런데 얘는 정상,

    24
    00:01:33,201 --> 00:01:36,527
    우리는 정상. 저희가 오기 전에 그 동네에서 만 원 주고 얘만 해봤거든요.

    25
    00:01:36,611 --> 00:01:40,217
    정상이에요. 근데 이 사람이 어저께 이거를 새로 해야 된다고 하니까

    26
    00:01:40,341 --> 00:01:44,377
    저희가 화가 나서 가져가기 전에 정상이었는데 가져가서 비정상입니다.

    27
    00:01:44,461 --> 00:01:48,617
    일찍이 말했더니 제가 정식으로 컴플레인 걸겠다라고 했더니 없던 일로 하자는

    28
    00:01:48,741 --> 00:01:52,797
    거예요. 씨유를 새 걸로 떼어가신 거죠. 그렇게 되면 혹시 다른 거 점검을

    29
    00:01:52,881 --> 00:01:56,617
    다 해보자. 일단 저희 걸로 한번 켜볼게요. 그래픽카드라도 지금 일단

    30
    00:01:56,701 --> 00:02:00,337
    한번 켜볼게요. 없었던 일로 하자고 얘기할 정도면 뭔가 튕기니까 없었던

    31
    00:02:00,441 --> 00:02:03,437
    일로 하자고 얘기하는 거 아니에요? 어머니도 의심이 많이 되시니까 지금

    32
    00:02:03,581 --> 00:02:07,057
    얘기하시는 거잖아요. 당신이 한 게 비상식적이라 여기에 대한 책임을 지라

    33
    00:02:07,161 --> 00:02:10,867
    그랬더니 자기 꺼 빼가지고 간다고 하셨어. 그 뭘 책임진 거야? 없죠.

    34
    00:02:10,951 --> 00:02:15,917
    어머니한테 화낸 거 아니에요? 저희 걸로 해서? 돌려서 화면이 안

    35
    00:02:16,001 --> 00:02:20,447
    나오는 거는 팔십 프로 이상이 메모리 때문에. 얘가 문제가 있다니까. 얘

    36
    00:02:20,531 --> 00:02:24,397
    다시 꼽으면 다시 들어와요. 두 개 교환하면 빠른 거 아니에요? 맞아요.

    37
    00:02:24,481 --> 00:02:29,057
    그렇죠 켜졌죠. 집에 있는 씨피유도 뭐 이런 상황이었었을 것 같아요.

    38
    00:02:29,181 --> 00:02:33,297
    근데 뭔가 문제가 조금 있긴 하네. 팬이 고장나서 씨피유가 고장났다는

    39
    00:02:33,401 --> 00:02:36,677
    아니야. 연관성이 없다는 거죠. 그렇죠. 그냥 누워서 눈 감고 있는데 아우,

    40
    00:02:36,781 --> 00:02:40,959
    눈 감았으니까 돌아가셨습니다. 라고 얘기한 거랑 똑같아요. 그 얘기는.

    41
    00:02:42,259 --> 00:02:47,837
    저희가 한 것 가지고. 음. 또 뭐 편하신 대로. 분명히.
    근데 뭔가 그분께서 그걸로 해코지를 하셨을까봐 조금 불안한 거지 나는.

    42
    00:02:47,921 --> 00:02:51,537
    그래서 만약 고장났으면 어차피 그 사람이 한 벌 물어달라고 할 수도

    43
    00:02:51,641 --> 00:02:56,377
    없잖아요. 어떡해요. 뭐 잘못하셨는데 어머니께서 거꾸로 그러면. 아,

    44
    00:02:56,481 --> 00:02:59,437
    오는 순간부터 엄청 짜증을 내서 되게 불안했어요,

    45
    00:02:59,561 --> 00:03:02,957
    우리가. 그냥 경찰에 신고하면 돼요. 맞잖아요. 그걸 왜 우리가 해결해야

    46
    00:03:03,041 --> 00:03:07,317
    돼? 법이 해결해야죠. 잘못한 거 있으면 그 사람이 죗값을 받아야죠. 그래서

    47
    00:03:07,461 --> 00:03:11,377
    저의 개인적인 생각에선 조금 더 정확한 건 정밀진단을 해봐야 되겠지만,

    48
    00:03:11,521 --> 00:03:14,757
    이것 때문에 화면이 안 나왔던 건 아니었던 것 같아요. 메인보드가 백 프로,

    49
    00:03:14,861 --> 00:03:17,727
    컨디션이 백 프로입니다 라고 말씀드리기는 조금 힘들고.

    50
    00:03:17,811 --> 00:03:20,977
    찍고 계시던 씨피유를 가져와서 여기다 얹어봐야 정확한 걸 알 수

    51
    00:03:21,061 --> 00:03:26,437
    있을 것 같아요. 주말에 여기 휴무날? 네. 주말도 하고 오시기 전에.

    52
    00:03:26,601 --> 00:03:30,437
    저녁에는 몇 시에 온다고? 일곱시 반까지. 자,

    53
    00:03:30,521 --> 00:03:34,817
    일단은 그래서 씨피유를 가지고 지금 개방을 하신 거고.

    54
    00:03:34,981 --> 00:03:39,227
    한번 볼게요. 일단 지금 이렇게 그냥 막 싸져있는 거 보니까.

    55
    00:03:39,311 --> 00:03:43,017
    원래 일단 버리려고 했다가 혹시 몰라서. 지금 최대한 보존해서.

    56
    00:03:43,141 --> 00:03:46,717
    기존에 쓰시던 거 씨피유 장착. 아니 이게 또 성질 났던 것

    57
    00:03:46,841 --> 00:03:50,677
    중에 하나는 이 부분을 다 빼놨더라고. 지금 못 키게 하려고

    58
    00:03:50,781 --> 00:03:53,817
    이걸 빼놓은 건지 아니면 진짜 테스트하려고 이거를 다 빼놓은

    59
    00:03:53,901 --> 00:03:59,937
    건지 그냥. 이 화면을 못 봤던 거예요?

    60
    00:04:00,021 --> 00:04:05,027
    처음에 안 켜져서 불렀던 거였어요. 진짜요? 네. 잘 되는 걸 버렸으면.

    61
    00:04:05,111 --> 00:04:10,077
    어우 억울하다. 진짜 열 받는다. 진짜 열 받는다. 고발해야 돼. 그

    62
    00:04:10,161 --> 00:04:16,797
    전화번호 해서 고발해야겠다. 당하고 와서 뒤늦게 오시는 분들이 더 많아요.
    그 사람이 실력은 그것밖에 안 되는 거예요.

    63
    00:04:16,921 --> 00:04:21,397
    진짜 열 받는다. 이 발열량을 다 커버할 수 있는 쿨러는 아니에요,

    64
    00:04:21,521 --> 00:04:25,537
    사실 얘는. 한 요 정도 되는 쿨러. 저번에는 한 줄이었잖아요.

    65
    00:04:25,621 --> 00:04:30,647
    쿨러만 장착을 하시면 요 친구 다음 버전으로 씨피유가 몇 개가 더 나왔어요.

    66
    00:04:30,731 --> 00:04:33,157
    좀 더 좋은 애들이 오천 번대 씨피유도

    67
    00:04:33,281 --> 00:04:36,397
    있고 엑스 쓰리디라 그래서 게임 특화돼있는 그런 씨피유도 있긴

    68
    00:04:36,501 --> 00:04:40,567
    한데 하셔도 이 정도만 하시면 충분히 다 쿨러는 가능하니까.

    69
    00:04:40,651 --> 00:04:45,657
    엄청 대단하게 보여요. 너무 진짜 대박이다. 진짜 저희가

    70
    00:04:45,741 --> 00:04:49,797
    대단한 게 아니라 이게 정상인 거예요. 아유 그래도 이게 어디 아유.

    71
    00:04:49,881 --> 00:04:52,627
    저희 입장에서 보면 이건 뭐. 아니 너무 신기하잖아요,

    72
    00:04:52,711 --> 00:04:58,467
    지금. 아니 우리 근데 그래픽이랑 씨피유 다 바꿀 뻔 했네.
    출장의 최대의 단점이지. 나름 전문가라고 앞에 와 있는

    73
    00:04:58,551 --> 00:05:02,317
    사람이니까 믿을 수밖에 없는 상황이고 하라는 대로 다 하게 되니까.

    74
    00:05:02,401 --> 00:05:07,577
    버리라고 그러면 멀쩡했던 씨피유도 냉장 그 뭐 쓰레기통에서까지.
    쓰레기통까지 들어갔다 지금 빼온 거예요. 어어어.

    75
    00:05:07,661 --> 00:05:12,399
    그렇게 될 수밖에 없는 거예요. 고맙습니다. 조심히 들어가세요. 네.

    `);

  const [error, setError] = useState(false);

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
        } else if (response.error_msg) {
          setError(true);
          toast.error(response.error_msg);
          setStep("");
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
        const status = await getTranslationStatus(translation_request_id);
        if (status === 1) {
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
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader?.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });

            const isValidChunk = chunk.startsWith('0:"');

            if (isValidChunk) {
              const value = chunk.split('0:"')[1];
              const cleanedChunk = value.trim().slice(0, -1);

              const formattedChunk = cleanedChunk.replaceAll("\\n", "\n");

              setTranslation((prev) => prev + formattedChunk);
            } else if (chunk.includes("An error occurred")) {
              setError(true);
              toast.error("An error occurred generating the translation");
            }
          }
        }

        setStep(TRANSCRIPTIONS_STEPS[6]);
      }
    };

    fetchStream();
  }, [requestId, step]);

  const handleVideoInfo = async (videoInfo: VideoInfo) => {
    if (videoInfo.id === "") {
      setError(false);
    }

    // set Video
    setVideoInfo(videoInfo);
    setStep(TRANSCRIPTIONS_STEPS[1]);

    if (!videoInfo.url) {
      // setError("Invalid video URL");
      return;
    }

    // fetch /autotemplate/request
    const { request_id } = await requestTranscription(
      videoInfo.url,
      videoInfo.lng,
    );
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

            <div className="max-w-2xl">
              {(step === TRANSCRIPTIONS_STEPS[5] ||
                step === TRANSCRIPTIONS_STEPS[6]) && (
                <Translation
                  isCompleted={isCompleted}
                  translation={translation}
                  error={error}
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
