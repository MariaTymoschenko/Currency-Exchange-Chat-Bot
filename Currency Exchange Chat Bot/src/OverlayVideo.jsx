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
  // const [isVisible, setIsVisible] = useState(false);

  // const playVideo = () => {
  //   setIsVisible(true); // Make the video overlay visible
  // };

  // const closeVideo = () => {
  //   const videoElement = videoRef.current;

  //   if (videoElement) {
  //     videoElement.pause();
  //     setIsVisible(false); // Hide video overlay
  //   }
  // };

  // useEffect(() => {
  //   if ( videoRef.current)
  //   {
  //       videoRef.current.play();
  //       videoRef.current.onended = () => setIsVisible(false); // Hide video overlay when playback ends

  //   }}, [isVisible]
  // );

  return (
    <div>
      { (
        // <div
        //   style={{
        //     position: 'fixed',
        //     top: 0,
        //     left: 0,
        //     width: '100vw',
        //     height: '100vh',
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //   }}
        // >
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
        /* <video
          autoPlay muted loop
            style={{
              width: 'auto',
              height: '100%',
              // objectFit: 'cover',
            //  mixBlendMode: 'multiply',
            //  filter: 'sepia(100%)',
              // opacity: 0.9, // Half-transparent video
              // borderRadius: '10px',
              // boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <source 
            src="/public/animations/money.mp4"/>
          </video> */
          
        //  </div>
      )}
    </div>
  );
};

export default OverlayVideo;