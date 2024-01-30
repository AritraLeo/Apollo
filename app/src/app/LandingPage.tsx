import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Camera from './components/Camera';
import Scoreboard from './components/Scoreboard';

const LandingPage: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Beauty App</title>
        <link rel="stylesheet" href="/styles/global.css" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-pink">
        <Camera handleCapture={(image) => setCapturedImage(image)} handleScore={(score) => setScore(score)} />
        {capturedImage && (
          <div className="mt-8">
            <Image src={capturedImage} alt="Captured image" width={480} height={360} />
          </div>
        )}
        {score !== null && (
          <div className="mt-4 text-cherry">
            <Scoreboard image={capturedImage || ''} score={score} />
          </div>
        )}
      </main>
    </>
  );
};

export default LandingPage;
