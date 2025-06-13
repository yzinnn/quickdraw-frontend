import React, { useState } from 'react';
import StartScene from './StartScene';
import Scene from './Scene';
import './App.css';

function App() {
  const [currentScene, setCurrentScene] = useState('start');

  const handleSceneComplete = (nextScene) => {
    setCurrentScene(nextScene);
  };

  const renderCurrentScene = () => {
    switch (currentScene) {
      case 'scene1': // 웅덩이 장면
        return (
          <Scene
            sceneId="scene1"
            promptBackgroundImg="/images/puddle-bg.png"
            characterImg="/images/character.png"
            promptDialog="어라, 커다란 물웅덩이다. 어떡하지?\n 아참! 마술 연필이 있지!"
            drawingDialog="마술연필로 웅덩이를 건널 방법을 그려서 웹캠에 보여줘!"
            classes={['angel', 'dragon', 'shoe']} // scene1에서 인식할 그림 종류
            onComplete={handleSceneComplete} // handleSceneComplete 함수 직접 전달
            nextScene="scene2" // 다음 씬 ID
          />
        );
      case 'scene2': // 사자 장면
        return (
          <Scene
            sceneId="scene2"
            promptBackgroundImg="/images/lion_bg.png" // 이미지 경로 수정
            characterImg="/images/character.png"
            promptDialog="으악! 무서운 사자가 길을 막고 있어!"
            drawingDialog="마술 연필로 사자를 지나갈 방법을 그려줘!"
            classes={['mouse', 'rabbit', 'airplane']} // scene2에서 인식할 그림 종류
            onComplete={handleSceneComplete}
            nextScene="scene3"
          />
        );
      case 'scene3': // 하늘 구멍 장면
        return (
          <Scene
            sceneId="scene3"
            promptBackgroundImg="/images/sky_bg.png" // 이미지 경로 수정
            characterImg="/images/character.png"
            promptDialog="으악! 하늘에 구멍이 뚫렸어!"
            drawingDialog="마술 연필로 구멍을 메울 걸 그려줘!"
            classes={['cloud', 'tree', 'bandage']} // scene3에서 인식할 그림 종류
            onComplete={handleSceneComplete}
            nextScene="final"
          />
        );
case 'final': // 엔딩 장면
        return (
          <div className="scene-container" style={{backgroundColor: '#222'}}>
            <h1 style={{ color: 'white', textAlign: 'center', fontSize: '4em' }}>모험 끝!</h1>
            <button
                className="final-scene-button"
                onClick={() => window.location.reload()}
              >
                처음으로 돌아가기
              </button>
          </div>
        );
      default: // 시작 장면
        return (
          <StartScene onComplete={() => handleSceneComplete('scene1')} />
        );
    }
  };

  return (
    <div className="app-container">
      {renderCurrentScene()}
      {/* 웹캠은 Scene 컴포넌트 내에서 렌더링되므로, App.js에서는 제거거 */}
    </div>
  );
}

export default App;