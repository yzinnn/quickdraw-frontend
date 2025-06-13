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
      case 'scene1':
        return (
          <Scene
            sceneId="scene1"
            promptBackgroundImg="/images/puddle-bg.png"
            characterImg="/images/character.png"
            promptDialog="어라, 커다란 물웅덩이다. 어떡하지? 아참! 마술 연필이 있지!"
            drawingDialog="마술연필로 웅덩이를 건널 방법을 그려서 웹캠에 보여줘!"
            classes={['angel', 'dragon', 'shoe']}
            onComplete={handleSceneComplete}
            nextScene="scene2"
          />
        );
      case 'scene2':
        return (
          <Scene
            sceneId="scene2"
            promptBackgroundImg="/images/lion_bg.png"
            characterImg="/images/character.png"
            promptDialog="으악! 무서운 사자가 길을 막고 있어!"
            drawingDialog="마술 연필로 사자를 지나갈 방법을 그려줘!"
            classes={['mouse', 'rabbit', 'airplane']}
            onComplete={handleSceneComplete}
            nextScene="scene3"
          />
        );
      case 'scene3':
        return (
          <Scene
            sceneId="scene3"
            promptBackgroundImg="/images/sky_bg.png"
            characterImg="/images/character.png"
            promptDialog="으악! 하늘에 구멍이 뚫렸어!"
            drawingDialog="마술 연필로 구멍을 메울 걸 그려줘!"
            classes={['cloud', 'tree', 'bandage']}
            onComplete={handleSceneComplete}
            nextScene="final"
          />
        );
      case 'final':
        return (
          <div
            className="scene-container"
            style={{
              backgroundImage: 'url(/images/final_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '40px',
              backgroundColor: '#fff7cd',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <h1 style={{
              color: 'rgb(102, 32, 7)',
              textAlign: 'center',
              fontSize: '4em',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}>
              모험 끝!
            </h1>
            <button
              className="final-scene-button"
              style={{
                marginTop: '40px',
                padding: '15px 30px',
                fontSize: '1.2em',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#ff8c00',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
              onClick={() => window.location.reload()}
            >
              처음으로 돌아가기
            </button>
          </div>
        );
      default:
        return (
          <StartScene onComplete={() => handleSceneComplete('scene1')} />
        );
    }
  };

  return (
    <div className="app-container">
      {renderCurrentScene()}
    </div>
  );
}

export default App;
