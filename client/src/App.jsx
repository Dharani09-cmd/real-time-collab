import React from 'react';
import Chat from './components/Chat';

export default function App(){
  return (
    <div className="app">
      <h1>Real-Time Collab (React + Socket.IO)</h1>
      <Chat />
    </div>
  );
}
