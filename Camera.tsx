import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceApi from 'face-api.js';

const Camera = ({ handleScore }: { handleScore: (score: number) => void }) => {
    const webcamRef = useRef<Webcam | null>(null);
    const [loading, setLoading] = useState(true);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);

    useEffect(() => {
        async function loadModels() {
            await faceApi.loadSsdMobilenetv1Model('/models/ssd_model.json');
            await faceApi.loadFaceLandmarkModel('/models/landmarks_model.json');
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
        } else {
            // Handle the case where the image is null (e.g., show an error message)
            console.error("Failed to capture image");
        }
    };


    useEffect(() => {
        const processCapturedImage = async () => {
            if (!capturedImage) return;

            // Convert the Blob to an HTMLImageElement
            const img = new Image();
            img.src = URL.createObjectURL(capturedImage);

            // Wait for the image to load
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Now, you can use the HTMLImageElement with face-api.js
            // const canvas = await faceApi.createCanvasFromMedia(img);
            // Now, you can use the HTMLImageElement with face-api.js
            const detectionsWithLandmarks = await faceApi.detectAllFaces(img).withFaceLandmarks();

            if (detectionsWithLandmarks.length > 0) {
                // Assuming only one face
                const landmarks = detectionsWithLandmarks[0].landmarks;

                // Accessing specific landmarks
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
        return <p>Loading...</p>;
    }

    return (
        <div className="webcam-container">
            <Webcam ref={webcamRef} width={480} height={360} screenshotFormat="image/jpeg" />
            <button className="capture-button" onClick={handleCaptureClick}>
                Capture Image
            </button>
        </div>
    );
};

export default Camera;
