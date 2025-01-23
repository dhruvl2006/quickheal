import React from "react";

function Video({ ref }) {
  return <video ref={ref} autoPlay playsInline className="w-full h-auto object-cover"></video>;
}

export default Video;
