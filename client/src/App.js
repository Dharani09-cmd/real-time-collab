import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocumentPage from './pages/Document';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/documents/:id" element={<DocumentPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
