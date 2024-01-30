import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceApi from 'face-api.js';

interface CameraProps {
  handleScore: (score: number) => void;
  handleCapture: (image: any) => void;
}

const Camera: React.FC<CameraProps> = ({ handleScore, handleCapture }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);

  useEffect(() => {
    async function loadModels() {
      await faceApi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceApi.nets.faceLandmark68Net.loadFromUri('/models');
      setLoading(false);
    }
    loadModels();
  }, []);

  const handleCaptureClick = () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();

    if (image) {
      const blob = new Blob([image], { type: 'image/jpeg' });
      setCapturedImage(blob);
      handleCapture(image);
    } else {
      console.error("Failed to capture image");
    }
  };

  useEffect(() => {
    const processCapturedImage = async () => {
      if (!capturedImage) return;

      const img = new Image();
      img.src = URL.createObjectURL(capturedImage);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const detectionsWithLandmarks = await faceApi.detectAllFaces(img).withFaceLandmarks();

      if (detectionsWithLandmarks.length > 0) {
        const landmarks = detectionsWithLandmarks[0].landmarks;

        const foreheadToEyes =
          landmarks.positions[27].y - landmarks.positions[23].y;
        const eyesToNose = landmarks.positions[33].y - landmarks.positions[27].y;
        const noseToChin = landmarks.positions[8].y - landmarks.positions[33].y;

        const score = ((foreheadToEyes + eyesToNose) / noseToChin) * 1.618 + eyesToNose / foreheadToEyes;
        handleScore(score);
      }
    };

    processCapturedImage();
  }, [capturedImage, handleScore]);

  if (loading) {
    return <p className="text-blue">Loading...</p>;
  }

  return (
    <div className="webcam-container bg-white p-4">
      <Webcam ref={webcamRef} width={480} height={360} screenshotFormat="image/jpeg" />
      <button className="capture-button bg-pink text-white px-4 py-2 mt-4" onClick={handleCaptureClick}>
        Capture Image
      </button>
    </div>
  );
};

export default Camera;
