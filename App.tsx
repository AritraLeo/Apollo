import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import CameraScreen from 'react-native-camera-kit';

interface FaceFeatures {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  nose: { x: number; y: number };
  mouth: { x: number; y: number };
}

interface CustomFace {
  bounds: {
    origin: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
  faceID: number;
  // Add any other properties that are part of the face structure
}

const App = () => {
  const [faces, setFaces] = useState<FaceFeatures[]>([]);
  const cameraRef = useRef<typeof CameraScreen>(null);

  useEffect(() => {
    (async () => {
      const status = await CameraScreen.requestCameraPermission();
      if (status !== 'authorized') {
        alert('Camera permission is required for this app.');
      }
    })();
  }, []);

  const onFacesDetected = (faces: CustomFace[]) => {
    const extractedFaces: FaceFeatures[] = faces.map((face) => ({
      leftEye: { x: face.bounds.origin.x, y: face.bounds.origin.y },
      rightEye: { x: face.bounds.origin.x + face.bounds.size.width, y: face.bounds.origin.y },
      nose: {
        x: face.bounds.origin.x + face.bounds.size.width / 2,
        y: face.bounds.origin.y + face.bounds.size.height / 2,
      },
      mouth: {
        x: face.bounds.origin.x + face.bounds.size.width / 2,
        y: face.bounds.origin.y + face.bounds.size.height,
      },
    }));
    setFaces(extractedFaces);
  };

  const calculateDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const extractFeatures = (face: FaceFeatures) => ({
    eyeDistance: calculateDistance(face.leftEye, face.rightEye),
    mouthNoseDistance: calculateDistance(face.mouth, face.nose),
  });

  const calculateGoldenRatioScore = (features: { eyeDistance: number; mouthNoseDistance: number }) => {
    const goldenRatio = 1.618;
    let score = 0;
    score += Math.abs(features.eyeDistance) * 20;
    score += Math.abs((features.mouthNoseDistance / features.eyeDistance) - goldenRatio) * 10;
    score = (score / 30) * 100;
    return score;
  };

  const renderFace = (face: FaceFeatures) => {
    const features = extractFeatures(face);
    const faceScore = calculateGoldenRatioScore(features);
    return (
      <View key={face.leftEye.x + face.leftEye.y}>
        <Text>Your Golden Ratio Score: {faceScore.toFixed(2)}</Text>
        <Text>Disclaimer: Beauty is subjective! This is just for fun.</Text>
        <Button title="Take another picture" onPress={() => setFaces([])} />
      </View>
    );
  };

  return (
    <>
    <View style={{ flex: 1 }}>
      <CameraScreen
        ref={cameraRef}
        style={{ flex: 1 }}
        captureAudio={false}
        faceDetectionMode={CameraScreen.FaceDetectionMode.Fast}
        onFacesDetected={onFacesDetected}
        />
      {faces.map((face) => renderFace(face))}
    </View>
    </>
  );
};

export default App;
