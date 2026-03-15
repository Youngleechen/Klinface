// components/SecureVideoPlayer.tsx
'use client';

import React from 'react';

interface SecureVideoPlayerProps {
  src: string;
}

export default function SecureVideoPlayer({ src }: SecureVideoPlayerProps) {
  const handleContextMenu = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
  };

  return (
    <div className="relative aspect-video w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        controls
        className="w-full h-full object-contain"
        onContextMenu={handleContextMenu}
        disablePictureInPicture
        controlsList="nodownload"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}