import React from 'react';
import './App.css';
import Board from './board/board';

function App() {
  return (
    <div className="App">
      <div className="boardContainer"><Board height={20} width={20} difficulty={3} /></div>
      
    </div>
  );
}

export default App;
