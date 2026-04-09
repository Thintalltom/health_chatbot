import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../index';

interface TranscriptEntry {
  speaker: string;
  speaker_label: string;
  text: string;
  timestamp: string;
}

interface AISuggestion {
  type: 'follow_up' | 'recommendation';
  text: string;
  generated_at: string;
  used: boolean;
}

interface WebSocketMessage {
  type: 'started' | 'transcript' | 'suggestions' | 'error';
  entry?: TranscriptEntry;
  suggestions?: AISuggestion[];
  message?: string;
}

interface UseTranscriptionWebSocketProps {
  consultationId: string;
  patientId: string;
  onTranscriptEntry?: (entry: TranscriptEntry) => void;
  onSuggestions?: (suggestions: AISuggestion[]) => void;
  onError?: (error: string) => void;
}

export const useTranscriptionWebSocket = ({
  consultationId,
  patientId,
  onTranscriptEntry,
  onSuggestions,
  onError,
}: UseTranscriptionWebSocketProps) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const connect = useCallback(() => {
    if (!token || !consultationId) return;

    // Use the correct WebSocket URL for the backend
    const wsUrl = `wss://medaux.vercel.app/ws/transcribe/${consultationId}?token=${token}`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'started':
            setIsStarted(true);
            console.log('Transcription session started');
            break;
          case 'transcript':
            if (message.entry && onTranscriptEntry) {
              onTranscriptEntry(message.entry);
            }
            break;
          case 'suggestions':
            if (message.suggestions && onSuggestions) {
              onSuggestions(message.suggestions);
            }
            break;
          case 'error':
            if (message.message && onError) {
              onError(message.message);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      setIsStarted(false);
      console.log('WebSocket disconnected');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) {
        onError('WebSocket connection failed - live transcription unavailable');
      }
      // Don't attempt to reconnect immediately to prevent loops
    };
  }, [token, consultationId, onTranscriptEntry, onSuggestions, onError]);

  const startSession = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const startMessage = {
        type: 'start',
        patient_id: patientId,
      };
      wsRef.current.send(JSON.stringify(startMessage));
    }
  }, [patientId]);

  const stopSession = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const stopMessage = {
        type: 'stop',
      };
      wsRef.current.send(JSON.stringify(stopMessage));
    }
    setIsStarted(false);
  }, []);

  const startAudioStreaming = useCallback(async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context for processing
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Create processor for 16-bit PCM conversion
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.onaudioprocess = (event) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isStarted) {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          
          // Convert float32 to 16-bit PCM
          const pcmBuffer = new Int16Array(inputBuffer.length);
          for (let i = 0; i < inputBuffer.length; i++) {
            const sample = Math.max(-1, Math.min(1, inputBuffer[i]));
            pcmBuffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          }
          
          // Send binary audio data
          wsRef.current.send(pcmBuffer.buffer);
        }
      };
      
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
    } catch (error) {
      console.error('Error starting audio streaming:', error);
      if (onError) {
        onError('Failed to access microphone');
      }
    }
  }, [isStarted, onError]);

  const stopAudioStreaming = useCallback(() => {
    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Clean up audio context
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    stopAudioStreaming();
    stopSession();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, [stopAudioStreaming, stopSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    startSession,
    stopSession,
    startAudioStreaming,
    stopAudioStreaming,
    isConnected,
    isStarted,
  };
};