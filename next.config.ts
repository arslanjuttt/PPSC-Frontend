import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@ffmpeg-installer/ffmpeg",
    "@ffmpeg-installer/darwin-x64",
    "fluent-ffmpeg",
    "ytdl-core",
  ],
};

export default nextConfig;
