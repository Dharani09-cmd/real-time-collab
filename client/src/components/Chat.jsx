import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socket;

export default function Chat(){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const boxRef = useRef();

  useEffect(()=>{
    // connect to same origin (server serves client)
    socket = io();
    socket.on('connect', () => {
      console.log('connected', socket.id);
    });
    socket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, {from:'friend', text: msg}]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    if(boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  function send(){
    const t = text.trim();
    if(!t) return;
    setMessages(prev => [...prev, {from:'you', text: t}]);
    socket.emit('chat-message', t);
    setText('');
  }

  return (
    <div>
      <div id="chat-box" ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className={"message " + (m.from==='you'?'you':'friend')}>
            <strong>{m.from === 'you' ? 'You' : 'Friend'}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." onKeyDown={e=>{ if(e.key==='Enter') send(); }} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
