import { VideoInfo } from "@/interfaces/global-interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const VideoCard = ({
  videoInfo,
  isLoading,
}: {
  videoInfo: VideoInfo;
  isLoading: boolean;
}) => {
  if (isLoading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton
            className="w-[200px] h-[150px]"
            style={{ width: "200px", marginBottom: "10px" }}
          />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6" />
        </CardContent>
      </Card>
    );

  if (videoInfo?.id === "") return null;

  return (
    <Card className="w-fit mx-auto max-w-2xl p-0 slide-up-enter">
      <CardContent className="flex gap-3 p-0">
        <img
          src={videoInfo.thumbnail}
          alt="Video Thumbnail"
          width={220}
          alt=""
        />

        <div className="flex flex-col justify-center px-8">
          <p>
            <strong>Title:</strong> {videoInfo.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
