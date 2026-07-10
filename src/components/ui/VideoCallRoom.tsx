import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  MonitorUp, PhoneOff, Phone, 
  Settings, Users, Maximize 
} from 'lucide-react';

export default function VideoCallRoom() {
  // Call States
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Media Stream State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Bind the media stream to the video element whenever it changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Clean up media tracks when component unmounts
  useEffect(() => {
    return () => {
      stopAllMediaTracks();
    };
  }, []);

  const stopAllMediaTracks = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
  };

  // --- Handlers ---

  const startCall = async () => {
    try {
      setError(null);
      // Request actual camera and mic access via WebRTC API
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setIsCallActive(true);
      setIsAudioMuted(false);
      setIsVideoOff(false);
    } catch (err) {
      console.error("Failed to get media devices:", err);
      // Fallback: Still open the UI even if they deny camera access (for mock purposes)
      setError("Camera/Mic access denied. Running in visual mock mode.");
      setIsCallActive(true);
    }
  };

  const endCall = () => {
    stopAllMediaTracks();
    setIsCallActive(false);
    setIsScreenSharing(false);
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // Replace video track with screen track
        const videoTrack = screenStream.getVideoTracks()[0];
        
        if (localStream && localVideoRef.current) {
          const sender = localStream.getVideoTracks()[0];
          localStream.removeTrack(sender);
          localStream.addTrack(videoTrack);
          localVideoRef.current.srcObject = localStream;
        } else {
          setLocalStream(screenStream);
        }
        
        setIsScreenSharing(true);
        setIsVideoOff(false);

        // Handle native browser "Stop sharing" button
        videoTrack.onended = () => {
          stopScreenShareAndRevertToCamera();
        };

      } catch (err) {
        console.error("Screen sharing failed:", err);
      }
    } else {
      stopScreenShareAndRevertToCamera();
    }
  };

  const stopScreenShareAndRevertToCamera = async () => {
    stopAllMediaTracks();
    setIsScreenSharing(false);
    // Restart normal camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: !isVideoOff, audio: !isAudioMuted });
    setLocalStream(stream);
  };

  // --- UI Renders ---

  // 1. Inactive State (Pre-call)
  if (!isCallActive) {
    return (
      <div className="w-full bg-primary-950 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg border border-primary-900">
        <div className="bg-primary-900 p-4 rounded-full mb-4">
          <Video className="w-8 h-8 text-primary-300" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Investor Strategy Meeting</h2>
        <p className="text-primary-200 mb-6 text-sm max-w-md">
          Ready to pitch? Your camera and microphone are currently off. Click below to enter the secure WebRTC staging room.
        </p>
        <button 
          onClick={startCall}
          className="flex items-center px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors shadow-md shadow-secondary-500/20"
        >
          <Phone className="w-5 h-5 mr-2" />
          Join Meeting Now
        </button>
      </div>
    );
  }

  // 2. Active Call State
  return (
    <div className="w-full bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col relative animate-fade-in" style={{ height: '600px' }}>
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center text-white">
          <span className="flex h-3 w-3 mr-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-medium text-sm tracking-wide">00:14:32 • Encrypted Call</span>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white backdrop-blur-sm transition">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white backdrop-blur-sm transition">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Area (The Investor/Remote User Mock) */}
      <div className="flex-1 w-full h-full bg-gray-900 flex items-center justify-center relative">
        {/* Placeholder for the Investor */}
        <div className="text-center flex flex-col items-center">
          <div className="w-32 h-32 bg-primary-800 rounded-full flex items-center justify-center text-4xl text-primary-200 border-4 border-primary-700 shadow-xl mb-4">
            SC
          </div>
          <h3 className="text-xl font-semibold text-white">Sarah Chen</h3>
          <p className="text-gray-400 text-sm">Investor • Connected</p>
        </div>

        {/* Error overlay if camera fails */}
        {error && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-md text-sm z-20 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Picture-in-Picture (Local Camera) */}
        <div className="absolute bottom-24 right-6 w-48 h-32 bg-black rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl z-10 transition-all hover:scale-105">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
              <VideoOff className="w-6 h-6" />
            </div>
          ) : (
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted // Always mute local video playback to prevent feedback loop
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
          )}
          
          {isAudioMuted && (
            <div className="absolute bottom-2 right-2 bg-red-500 p-1 rounded-md">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center z-10 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center space-x-4 bg-gray-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700">
          
          {/* Mic Toggle */}
          <button 
            onClick={toggleAudio}
            className={`p-3 rounded-xl transition-all ${isAudioMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            title={isAudioMuted ? "Unmute" : "Mute"}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button 
            onClick={toggleVideo}
            className={`p-3 rounded-xl transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            title={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share Toggle */}
          <button 
            onClick={toggleScreenShare}
            className={`p-3 rounded-xl transition-all ${isScreenSharing ? 'bg-secondary-500/20 text-secondary-500 hover:bg-secondary-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-gray-600 mx-2"></div>

          {/* Settings Mock */}
          <button className="p-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all">
            <Settings className="w-5 h-5" />
          </button>

          {/* End Call */}
          <button 
            onClick={endCall}
            className="p-3 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all flex items-center shadow-lg shadow-red-500/20 ml-2"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            Leave
          </button>

        </div>
      </div>
    </div>
  );
}