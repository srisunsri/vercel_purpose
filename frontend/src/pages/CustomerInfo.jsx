import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import 'tailwindcss/tailwind.css';

const CustomerInfo = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [modules, setModules] = useState([]);
  const [insights, setInsights] = useState([]); // State for insights
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [mp3URL, setMp3URL] = useState(""); // URL for MP3 file
  const [uploadStatus, setUploadStatus] = useState(""); // Status of the upload
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await fetch(`${BACKEND_URL}/api/t/customers?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setCustomer(data);
    };

    const fetchModules = async () => {
      const res = await fetch(`${BACKEND_URL}/api/t/module?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setModules(data);
    };

    const fetchInsights = async () => {
      const res = await fetch(`${BACKEND_URL}/api/t/insights?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setInsights(data.insights || []);
    };

    fetchCustomer();
    fetchModules();
    fetchInsights();
  }, [id]);

  const handleRecord = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        // Convert WebM to MP3
        const mp3Url = await convertToMp3(audioBlob);
        setMp3URL(mp3Url);

        // Send MP3 Blob to Flask server
        uploadMp3(audioBlob);
      };

      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const convertToMp3 = async (audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const mp3Blob = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const webmToMp3 = window.WebmToMp3;
        webmToMp3.convert(reader.result, (mp3Data) => {
          resolve(new Blob([mp3Data], { type: 'audio/mp3' }));
        }, reject);
      };
      reader.readAsArrayBuffer(new Blob([arrayBuffer]));
    });
    return URL.createObjectURL(mp3Blob);
  };

  const uploadMp3 = async (mp3Blob) => {
    const formData = new FormData();
    formData.append("file", mp3Blob, "recording.mp3");

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setUploadStatus("Upload successful");
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      setUploadStatus("Upload error");
      console.error("Upload error:", error);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">{customer.name}</h2>
        <p className="text-lg mb-4">{customer.email}</p>
        {/* Display other customer details here */}
        <button
          className={`bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRecording ? 'bg-red-500' : ''}`}
          onClick={handleRecord}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioURL && <audio controls src={audioURL} className="mt-4"></audio>}
        {mp3URL && <a href={mp3URL} download="recording.mp3" className="mt-4 block text-blue-500 underline">Download MP3</a>}
        {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      </div>
      <div className="flex flex-wrap justify-center">
        {Object.entries(modules).map(([moduleName, completed]) => (
          <div
            key={moduleName}
            className="m-4 p-4 border rounded-lg shadow-lg w-64 bg-white"
          >
            <h2 className="text-xl font-bold mb-2">{moduleName}</h2>
            <p className={`text-lg ${completed ? "text-green-500" : "text-red-500"}`}>
              {completed ? "Completed" : "Not Completed"}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Insights</h2>
        {insights.map((insight, index) => (
          <div key={index} className="mb-4">
            <label className="block text-lg font-medium text-gray-700">{insight.name}</label>
            <p className="text-lg text-gray-900">{insight.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerInfo;
