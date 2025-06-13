// WebcamCapture.js
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function WebcamCapture({ onPredict, sceneId }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const captureAndPredict = async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setLoading(false);
      return;
    }

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "webcam.jpg");

    try {
      const res = await axios.post(`http://localhost:5000/predict/${sceneId}`, formData);
      console.log("예측 결과:", res.data);
      onPredict(res.data);
    } catch (err) {
      console.error("❌ 예측 실패!", err);
      alert("예측 서버에 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 스케치북 레이아웃: 기존의 div/인라인 스타일 대신 CSS 클래스로 제어하도록 구조를 변경.
  return (
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
        className="webcam-view"
      />
      <button
        onClick={captureAndPredict}
        disabled={loading}
        className="capture-button"
      >
        {loading ? "판독 중..." : "마술 연필 짠!"}
      </button>
    </>
  );
}

export default WebcamCapture;