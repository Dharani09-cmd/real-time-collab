import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const SAVE_INTERVAL_MS = 2000;

export default function DocumentPage(){
  const { id: documentId } = useParams();
  const [quill, setQuill] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const s = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
    setSocket(s);
    return ()=> s.disconnect();
  }, []);

  useEffect(()=>{
    if (!socket) return;
    const qContainer = document.createElement('div');
    qContainer.style.height = '60vh';
    qContainer.className = 'editor';
    const editor = document.createElement('div');

    qContainer.appendChild(editor);
    document.getElementById('editor-root').innerHTML = '';
    document.getElementById('editor-root').appendChild(qContainer);

    const q = new Quill(editor, { theme: 'snow' });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
    return ()=>{
      q.disable();
      setQuill(null);
    };
  }, [socket]);

  useEffect(()=>{
    if (!socket || !quill) return;
    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit('join-document', documentId);

    const receiveHandler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', receiveHandler);

    const textHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', textHandler);

    const interval = setInterval(()=>{
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);

    return ()=>{
      socket.off('receive-changes', receiveHandler);
      quill.off('text-change', textHandler);
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  return (
    <div>
      <div className="header">
        <div>Document ID: {documentId}</div>
      </div>
      <div id="editor-root" className="container"></div>
    </div>
  );
}
