import React, { useRef, useState , useEffect} from 'react';
import ReactPlayer from 'react-player';
const OverlayVideo = () => {
  const videoRef = useRef(null);

  function canPlayWebM() {
    var video = document.createElement('video');
    return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
  }
  
  if (canPlayWebM()) {
    console.log("Your browser supports WebM with transparency!");
  } else {
    console.log("Your browser does not support WebM with transparency.");
  }
  canPlayWebM();

  return (
    <div>
      { (
        <ReactPlayer
          url="/public/animations/output.webm"
          playing
          loop
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default OverlayVideo;