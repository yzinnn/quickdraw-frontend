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
      const res = await axios.post(`https://quickdraw-backend.onrender.com/predict/${sceneId}`, formData);
      console.log("예측 결과:", res.data);
      onPredict(res.data);
    } catch (err) {
      console.error("❌ 예측 실패!", err);
      alert("예측 서버에 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={480}
          height={360}
          className="rounded-xl shadow-lg"
        />
        <button
          onClick={captureAndPredict}
          disabled={loading}
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#3B82F6",
            color: "#fff",
            borderRadius: "0.5rem",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          {loading ? "예측 중..." : "이 그림으로 결정!"}
        </button>
      </div>
    </div>
  );
}

export default WebcamCapture;
