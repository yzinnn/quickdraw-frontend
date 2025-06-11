import React, { useState, useEffect } from 'react';
import WebcamCapture from './WebcamCapture';

function Scene({ sceneId, promptBackgroundImg, characterImg, promptDialog, drawingDialog, classes, onComplete, nextScene }) {
  const [gameState, setGameState] = useState('prompting');
  const [prediction, setPrediction] = useState(null);

  // 예측 처리 함수
  const handlePrediction = (result) => {
    console.log(`[${sceneId}] ✅ 예측 결과:`, result);

    if (result && classes.includes(result.label)) {
      setPrediction(result.label);
      setGameState('result');
    } else {
      console.warn(`[${sceneId}] ❌ 예측 실패:`, result?.label, '허용된 label:', classes);
      alert('인식에 실패했어요. 그림을 더 선명하게 보여주세요!');
    }
  };
  
  useEffect(() => {
    console.log(`[🔁 sceneId 변경됨 → 상태 초기화] sceneId: ${sceneId}`);
    setGameState('prompting');
    setPrediction(null);
  }, [sceneId]);

  // 결과 상태에서 4초 후 다음 씬으로 전환
  useEffect(() => {
    if (gameState === 'result') {
      console.log(`[${sceneId}] 🎬 result 상태 진입 → 4초 타이머 시작`);
      const timer = setTimeout(() => {
        console.log(`[${sceneId}] ✅ 다음 씬으로 이동: ${nextScene}`);
        onComplete(nextScene);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState, onComplete, nextScene]);

  // 버튼 누르면 drawing 상태로 진입
  const handleFirstClick = () => {
    setGameState('reacting');
    setTimeout(() => {
      setGameState('drawing');
    }, 2000);
  };

  // 상태별 화면 렌더링
  const renderSceneContent = () => {
    switch (gameState) {
      case 'reacting':
        return (
          <>
            <img src={characterImg} alt="character" className="character" />
            <div className="speech-bubble">마술 연필로 그림을 그려서 해결해보자!!</div>
          </>
        );

      case 'drawing':
        return (
          <>
            <div className="speech-bubble updated-bubble">{drawingDialog}</div>
            <div className="webcam-area">
              <WebcamCapture onPredict={handlePrediction} sceneId={sceneId} />
            </div>
          </>
        );

      case 'result':
        let effectImg = null;
        let characterStyle = {};
        let effectStyle = {};

        // 결과별 효과 이미지
        const effectMap = {
          dragon: '/images/dragon.png',
          shoe: '/images/winged-shoes.png',
          angel: '/images/wings.png',
          rabbit: '/images/rabbit.png',
          mouse: '/images/mouse.png',
          airplane: '/images/airplane.png',
          cloud: '/images/cloud.png',
          tree: '/images/tree.png',
          bandage: '/images/bandage.png',
        };

        if (['dragon', 'shoe', 'angel'].includes(prediction)) {
          characterStyle = { display: 'none' };
        }

        effectImg = effectMap[prediction] || null;

        return (
          <>
            <h1 className="result-text">{prediction}!</h1>
            <img
              src={characterImg}
              alt="character"
              className={`character ${prediction}-effect`}
              style={characterStyle}
            />
            {effectImg && (
              <img
                src={effectImg}
                alt="effect"
                className={`effect-overlay ${prediction}-effect`}
                style={effectStyle}
              />
            )}
          </>
        );

      case 'prompting':
      default:
        return (
          <>
            <img src={characterImg} alt="character" className="character" />
            <div className="speech-bubble">{promptDialog}</div>
            <button className="start-button updated-button" onClick={handleFirstClick}>
              다음
            </button>
          </>
        );
    }
  };

  // 배경 이미지 결정
  const getBackgroundImage = () => {
    if (gameState === 'drawing') {
      return `url('/images/sketchbook_background.png')`;
    }
    return `url(${promptBackgroundImg})`;
  };

  return (
    <div className="scene-container" style={{ backgroundImage: getBackgroundImage() }}>
      {renderSceneContent()}
    </div>
  );
}

export default Scene;
