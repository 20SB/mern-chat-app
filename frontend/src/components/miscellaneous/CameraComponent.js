import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@chakra-ui/react";

const CameraComponent = () => {
    const webcamRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [videoConstraints, setVideoConstraints] = useState({
        width: 1280,
        height: 720,
        facingMode: "user", // Default to user-facing camera
    });
    let mediaRecorder = null;

    const startRecording = () => {
        setIsRecording(true);
        setRecordedChunks([]);
        const stream = webcamRef.current.video.srcObject;
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                setRecordedChunks((prev) => [...prev, event.data]);
            }
        };
        mediaRecorder.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    const displayRecordedVideo = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
    };

    const switchCamera = () => {
        const currentFacingMode = videoConstraints.facingMode;
        const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
        setVideoConstraints({
            ...videoConstraints,
            facingMode: newFacingMode,
        });
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />
            {!isRecording ? (
                <Button onClick={startRecording}>Start Recording</Button>
            ) : (
                <Button onClick={stopRecording}>Stop Recording</Button>
            )}
            <Button onClick={displayRecordedVideo} disabled={recordedChunks.length === 0}>
                Display Recorded Video
            </Button>
            <Button onClick={switchCamera}>Switch Camera</Button>
            {recordedVideoUrl && <video src={recordedVideoUrl} controls />}
        </div>
    );
};

export default CameraComponent;
