// Scene.js
import React, { useState, useEffect } from 'react';
import WebcamCapture from './WebcamCapture';

function Scene({
  sceneId,
  promptBackgroundImg,
  characterImg,
  promptDialog,
  drawingDialog,
  classes,
  onComplete,
  nextScene
}) {
  const [gameState, setGameState] = useState('prompting');
  const [prediction, setPrediction] = useState(null);
  const fadeHole = sceneId === 'scene3' && prediction;


  // sceneId 바뀔 때 상태 초기화
  useEffect(() => {
    setGameState('prompting');
    setPrediction(null);
  }, [sceneId]);

  // 결과 후 자동 전환
  useEffect(() => {
    if (gameState === 'result') {
      const timer = setTimeout(() => onComplete(nextScene), 3500);
      return () => clearTimeout(timer);
    }
  }, [gameState, onComplete, nextScene]);

  const handleFirstClick = () => {
    setGameState('drawing');
  };

  const handlePrediction = (pred) => {
    if (pred && classes.includes(pred.label)) {
      setPrediction(pred.label);
      setGameState('result');
    } else {
      alert('인식에 실패했어요. 그림을 더 선명하게 보여주세요!');
      setGameState('drawing');
    }
  };

  // 효과 렌더링
  const renderEffects = () => {
    if (!prediction) return null;

    if (sceneId === 'scene1') {
      let effectImage = '';
      let animationClass = '';

      if (prediction === 'shoe') {
        effectImage = '/images/winged-shoes.png';
        animationClass = 'scene1-effect bounce-diag-out';
      } else {
        effectImage = `/images/${prediction}.png`;
        animationClass = 'scene1-effect fly-diag-out';
      }

      return (
        <img
          src={effectImage}
          alt={prediction}
          className={`effect-overlay ${animationClass}`}
          onError={(e) => (e.target.style.display = 'none')}
        />
      );
    }

    if (sceneId === 'scene2') {
      const effectImage = prediction === 'shoe' ? '/images/winged-shoes.png' : `/images/${prediction}.png`;

      return (
        <img
          src={effectImage}
          alt={prediction}
          className="effect-overlay scene2-effect bounce-diag-out"
        />
      );
    }

    if (sceneId === 'scene3') {
      if (prediction === 'tree') {
        return (
          <>
            <img
              src="/images/hole.png"
              alt="구멍"
              className="scene3-effect hole-image fade-out"
            />
            <img
              src="/images/tree.png"
              alt="나무"
              className="scene3-effect tree-effect"
            />
          </>
        );
      } else if (prediction === 'cloud') {
        return (
          <>
            <img src="/images/cloud1.png" alt="cloud1" className="effect-overlay cloud-fade-in-1" />
            <img src="/images/cloud2.png" alt="cloud2" className="effect-overlay cloud-fade-in-2" />
            <img src="/images/cloud3.png" alt="cloud3" className="effect-overlay cloud-fade-in-3" />
          </>
        );
      } else if (prediction === 'bandage') {
        return (
          <img
            src="/images/bandage.png"
            alt="bandage"
            className="effect-overlay expand-cover"
            onError={(e) => (e.target.style.display = 'none')}
          />
        );
      }
    }

    return null;
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'prompting':
        return (
          <>
            <img src={characterImg} alt="character" className="character" />
            <div className="speech-bubble">{promptDialog}</div>
            <button className="scene-next-button" onClick={handleFirstClick}>
              다음
            </button>
          </>
        );
      case 'drawing':
        return (
          <div className="drawing-container">
            <div className="speech-bubble speech-bubble--top">{drawingDialog}</div>
            <div className="sketchbook-layout">
              <img src="/images/sketchbook_bg.png" alt="스케치북 배경" className="sketchbook-base-image" />
              <div className="webcam-overlay-area">
                <WebcamCapture onPredict={handlePrediction} sceneId={sceneId} />
              </div>
            </div>
          </div>
        );
      case 'result':
        return renderEffects();
      default:
        return null;
    }
  };

  return (
    <div
      className="scene-container"
      style={{
        backgroundImage: gameState === 'drawing' ? 'none' : `url(${promptBackgroundImg})`
      }}
    >
      {gameState !== 'drawing' && gameState !== 'result' && (
        <img src={characterImg} alt="character" className="character" />
      )}
      {renderGameState()}

      {sceneId === 'scene3' && gameState !== 'drawing' && (
          <img
          src="/images/blackhole.png"
          className={`scene3-effect blackhole ${prediction ? 'fade-out' : ''}`}
          alt="blackhole"
          />
      )}

    </div>
  );
}

export default Scene;