/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import Workflow from './components/Workflow';
import TechStack from './components/TechStack';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Forum from './components/Forum';
import AdminDashboard from './components/AdminDashboard';
import History from './components/History';
import { SkinAnalysisResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = React.useState<SkinAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  const handleAnalysisComplete = async (result: SkinAnalysisResult, image: string) => {
    setAnalysisResult(result);
    setCapturedImage(image);

    // Save to Firestore if user is logged in
    if (user) {
      const path = 'analyses';
      try {
        await addDoc(collection(db, path), {
          userId: user.uid,
          timestamp: serverTimestamp(),
          imageUrl: image,
          condition: result.condition,
          healthScore: result.healthScore,
          detections: result.detections,
          recommendations: result.recommendations,
          confidence: result.confidence,
          message: result.message
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleScanStart = () => {
    setAnalysisResult(null);
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen selection:bg-brand-purple/30">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Scanner onAnalysisComplete={handleAnalysisComplete} onScanStart={handleScanStart} />

              <AnimatePresence>
                {analysisResult && capturedImage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                  >
                    <Dashboard result={analysisResult} image={capturedImage} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Workflow />
              <TechStack />
              <About />
              <Contact />
            </>
          } />
          <Route path="/forum" element={<Forum />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      <Footer />

      {/* Lighting/Background decorative elements */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#030014]" />
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-brand-blue/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}

