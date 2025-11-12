import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

export default function Home(){
  const [docId, setDocId] = useState('');
  const navigate = useNavigate();
  const create = () => {
    const id = nanoid(8);
    navigate('/documents/' + id);
  };
  const openDoc = () => {
    if (!docId) return;
    navigate('/documents/' + docId);
  };
  return (
    <div className="container">
      <div className="header"><h2>Real-Time Collab (Lite)</h2></div>
      <div style={{marginTop:20}}>
        <button onClick={create}>Create New Document</button>
        <div style={{marginTop:10}}>
          <input placeholder="Existing document id" value={docId} onChange={e=>setDocId(e.target.value)} />
          <button onClick={openDoc}>Open</button>
        </div>
      </div>
    </div>
  );
}
