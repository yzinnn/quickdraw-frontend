// StartScene.js


import React, { useState, useRef } from 'react';
import './App.css';

function StartScene({ onComplete }) {
  const [step, setStep] = useState(0); // 0: 시작 전, 1: 연필 발견, 2: 마술연필 확인
  const [showPencil, setShowPencil] = useState(true);
  const characterRef = useRef(null);

  const handleInteraction = () => {
    if (step === 0) { // 시작하기
      const character = characterRef.current;
      character.style.transform = 'translateX(200px)'; // 캐릭터 이동
      setTimeout(() => {
        setShowPencil(false); // 연필 사라짐
        setStep(1); // 다음 단계로
      }, 2000);
    } else if (step === 1) { // 다음 대사로
      setStep(2);
    } else if (step === 2) { // 인트로 완료
      onComplete();
    }
  };

  const renderSpeech = () => {
    switch (step) {
      case 1: return '어라? 연필이네?';
      case 2: return '이거! 그림을 그리면 그대로 나타나는 마술 연필인가봐!';
      default: return '시작 버튼을 눌러줘!';
    }
  };

  return (
    // forest-scene.png 와 같은 초기 배경 이미지를 사용한다고 가정
    <div className="scene-container" style={{ backgroundImage: `url('/images/forest-scene.png')` }}>
      <img
        src="/images/character.png"
        alt="character"
        ref={characterRef}
        className="character"
        style={{ transition: 'transform 2s ease-in-out' }}
      />

      {showPencil && (
        <img
          src="/images/pencil.png"
          alt="pencil"
          className="pencil-image" 
        />
      )}
      
      {/* 💥 대사창을 위로 올리기 위해 speech-bubble--top 클래스 추가 */}
      <div className="speech-bubble speech-bubble--top">{renderSpeech()}</div>

      {/* 💥 버튼이 겹치지 않도록 StartScene 전용 클래스 지정 */}
      <button className="start-scene-button" onClick={handleInteraction}>
        {step === 0 ? '시작' : '다음'}
      </button>
    </div>
  );
}

export default StartScene;