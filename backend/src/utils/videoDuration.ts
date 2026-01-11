import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpegPath as string);
ffmpeg.setFfprobePath(ffprobe.path);

export const getVideoDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error("ffprobe error:", err);
        return reject(err);
      }

      const seconds = metadata?.format?.duration ?? 0;

      // convert seconds → minutes (decimal)
      const minutes = Number((seconds / 60).toFixed(2));

      resolve(minutes);
    });
  });
};
