/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../store';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Square, Send, Sparkles, Play, Pause } from 'lucide-react';
import {
    useGenerateSoapMutation,
    useUpdateTranscriptMutation,
    useUploadAudioMutation,
    useEndConsultationMutation,
    useLazyGetAudioUrlQuery,
} from '../store/slices/consultationApiSlice';
import { useGetActiveConsultationQuery } from '../store/slices/dashboardApiSlice';
import { useTranscriptionWebSocket } from '../store/slices/useTranscriptionWebSocket';
import microphone from '../assets/svgs/microphone-2.svg'
import Notetext from '../assets/svgs/Notext.svg'
interface TranscriptionEntry {
    id: number;
    type: 'voice' | 'note';
    content: string;
    timestamp: string;
    speaker?: string;
    speaker_label?: string;
}

interface SoapNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    is_draft: boolean;
    edited_by_doctor: boolean;
    generated_at: string;
}

interface AISuggestion {
    type: 'follow_up' | 'recommendation';
    text: string;
    generated_at: string;
    used: boolean;
}

export function ConsultationSession() {
    const { id } = useParams();
    const location = useLocation();
    const token = useSelector((state: RootState) => state.auth.token);

    // Get active consultation to resolve correct IDs
    const { data: activeConsultationData } = useGetActiveConsultationQuery();

    // Use correct IDs from active consultation
    const consultationId = activeConsultationData?.active?.id || id;
    const patientId = activeConsultationData?.active?.patient_id || id;

    // API hooks
    const [generateSoap] = useGenerateSoapMutation();
    const [updateTranscript] = useUpdateTranscriptMutation();
    const [uploadAudio] = useUploadAudioMutation();
    const [endConsultation] = useEndConsultationMutation();
    const [getAudioUrl] = useLazyGetAudioUrlQuery();
    // const [updateSoapNote] = useUpdateSoapNoteMutation();

    // State
    const [isRecording, setIsRecording] = useState(false);
    const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
    const [noteInput, setNoteInput] = useState('');
    const [currentTranscription, setCurrentTranscription] = useState('');
    const [hasRecorded, setHasRecorded] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
    const [generatedSummary, setGeneratedSummary] = useState<SoapNote | null>(null);
    const [isConsultationEnded, setIsConsultationEnded] = useState(false);
    const [_aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
    const [_wsError, setWsError] = useState<string | null>(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [hasUploadedAudio, setHasUploadedAudio] = useState(false);
    const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string>('');
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const transcriptionsRef = useRef<TranscriptionEntry[]>([]);
    const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        transcriptionsRef.current = transcriptions;
    }, [transcriptions]);

    const toTranscriptPayload = (entries: TranscriptionEntry[]) => {
        return entries
            .filter((entry) => entry.content.trim().length > 0)
            .map((entry) => ({
                speaker: entry.speaker || 'doctor',
                speaker_label: entry.speaker_label || (entry.type === 'voice' ? 'Doctor' : 'Note'),
                text: entry.content,
                timestamp: entry.timestamp,
            }));
    };

    const uploadAudioAndTranscript = async (audioBlob: Blob) => {
        if (!consultationId || !patientId) {
            return;
        }

        setIsUploadingAudio(true);
        try {
            await uploadAudio({
                consultation_id: consultationId,
                patient_id: patientId,
                audio: audioBlob,
            }).unwrap();

            const transcriptPayload = toTranscriptPayload(transcriptionsRef.current);
            if (transcriptPayload.length > 0) {
                await updateTranscript({
                    consultation_id: consultationId,
                    patient_id: patientId,
                    transcript: transcriptPayload,
                }).unwrap();
            }

            setHasUploadedAudio(true);
            toast.success('Audio and transcript uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading audio/transcript:', error);
            let errorMessage = 'Failed to upload audio/transcript';
            if (error?.data?.detail) {
                errorMessage = error.data.detail;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsUploadingAudio(false);
        }
    };

    const handleAudioPlaybackToggle = async () => {
        if (!audioPlaybackUrl) {
            toast.error('No audio available');
            return;
        }

        if (isAudioPlaying && playbackAudioRef.current) {
            playbackAudioRef.current.pause();
            setIsAudioPlaying(false);
            return;
        }

        try {
            // Create a fresh Audio instance each time to avoid stale src / load issues
            const audio = new Audio(audioPlaybackUrl);
            playbackAudioRef.current = audio;
            audio.onended = () => setIsAudioPlaying(false);
            audio.onerror = (e) => {
                console.error('Audio error:', e, audio.error);
                setIsAudioPlaying(false);
                const code = audio.error?.code;
                if (code === MediaError.MEDIA_ERR_NETWORK || code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    toast.error('Audio file could not be loaded. The link may have expired.');
                } else {
                    toast.error('Unable to play audio');
                }
            };
            await audio.play();
            setIsAudioPlaying(true);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsAudioPlaying(false);
            toast.error('Unable to play audio');
        }
    };

    // WebSocket for live transcription
    // const {
    //     connect: connectWs,
    //     disconnect: disconnectWs,
    //     startSession: startWsSession,
    //     stopSession: stopWsSession,
    //     startAudioStreaming,
    //     stopAudioStreaming,
    //     isConnected: wsConnected,
    //     isStarted: wsStarted,
    // } = useTranscriptionWebSocket({
    //     consultationId: consultationId!,
    //     patientId: patientId!,
    //     onTranscriptEntry: (entry) => {
    //         const newEntry: TranscriptionEntry = {
    //             id: Date.now(),
    //             type: 'voice',
    //             content: entry.text,
    //             timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    //             speaker: entry.speaker,
    //             speaker_label: entry.speaker_label,
    //         };
    //         setTranscriptions(prev => [...prev, newEntry]);
    //     },
    //     onSuggestions: (suggestions) => {
    //         setAiSuggestions(prev => [...prev, ...suggestions]);
    //     },
    //     onError: (error) => {
    //         setWsError(error);
    //         console.error('WebSocket error:', error);
    //     },
    // });

    // Determine the source page from the location state or referrer
    const isFromScheduledPatients = location.state?.from === 'scheduled' ||
        location.pathname.includes('scheduled') ||
        window.document.referrer.includes('scheduled');

    const sourcePage = isFromScheduledPatients ? 'Scheduled Patients' : 'All Patients';
    const sourcePath = isFromScheduledPatients ? '/patientTable?tab=scheduled' : '/patientTable?tab=all';

    // Load existing consultation data - WebSocket disabled for now
    useEffect(() => {
        // WebSocket connection disabled due to server issues
        // TODO: Re-enable when WebSocket server is available
        console.log('=== CONSULTATION SESSION ===');
        console.log('URL Parameter ID:', id);
        console.log('Consultation ID:', consultationId);
        console.log('Patient ID:', patientId);
        console.log('Active consultation data:', activeConsultationData);
        console.log('============================');
    }, [id, consultationId, patientId, activeConsultationData]);
    // Initialize speech recognition and WebSocket session
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscriptions(prev => [...prev, {
                        id: Date.now(),
                        type: 'voice',
                        content: finalTranscript,
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                    setCurrentTranscription('');
                } else {
                    setCurrentTranscription(interimTranscript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    // Audio level monitoring for waveform
    const monitorAudioLevel = () => {
        if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            setAudioLevel(average / 255); // Normalize to 0-1

            if (isRecording) {
                animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
            }
        }
    };

    const startRecording = async () => {
        try {
            // WebSocket disabled - using local recording only
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            setRecordedAudioBlob(null);
            setHasUploadedAudio(false);

            // Set up audio analysis for waveform
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                if (audioChunksRef.current.length === 0) {
                    return;
                }

                const finalAudioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setRecordedAudioBlob(finalAudioBlob);
                await uploadAudioAndTranscript(finalAudioBlob);
            };

            mediaRecorderRef.current.start(1000);
            setIsRecording(true);
            setHasRecorded(true);
            if (playbackAudioRef.current) {
                playbackAudioRef.current.pause();
                playbackAudioRef.current.currentTime = 0;
                setIsAudioPlaying(false);
            }

            // Start audio level monitoring
            monitorAudioLevel();

            // Use local speech recognition as fallback
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        setIsRecording(false);
        setAudioLevel(0);
        setCurrentTranscription('');
    };

    const handleAddNote = () => {
        if (noteInput.trim()) {
            setTranscriptions(prev => [...prev, {
                id: Date.now(),
                type: 'note',
                content: noteInput.trim(),
                timestamp: new Date().toLocaleTimeString()
            }]);
            setNoteInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddNote();
        }
    };

    const generateSummary = async () => {
        if (!consultationId || !patientId) {
            console.error('No consultation ID available');
            return;
        }

        try {
            // Fallback upload in case user generates summary before onstop upload completes
            if (recordedAudioBlob && !hasUploadedAudio && !isUploadingAudio) {
                console.log('Uploading audio file...', {
                    consultationId,
                    patientId,
                    audioSize: recordedAudioBlob.size
                });

                await uploadAudioAndTranscript(recordedAudioBlob);
            }

            const transcriptPayload = toTranscriptPayload(transcriptionsRef.current);
            if (transcriptPayload.length > 0) {
                await updateTranscript({
                    consultation_id: consultationId,
                    patient_id: patientId,
                    transcript: transcriptPayload,
                }).unwrap();
            }

            // Step 2: Generate SOAP note from transcript (HTTP POST)
            console.log('Generating SOAP note and fetching audio URL...');
            const [generatedSoap, fetchedAudioUrl] = await Promise.all([
                generateSoap({
                    consultation_id: consultationId,
                    patient_id: patientId
                }).unwrap(),
                getAudioUrl({
                    consultation_id: consultationId,
                    patient_id: patientId,
                }).unwrap(),
            ]);

            const soapNote = (generatedSoap as any)?.soap_note ?? generatedSoap;
            setGeneratedSummary(soapNote as SoapNote);
            setAudioPlaybackUrl(fetchedAudioUrl || '');
            console.log('SOAP note generated successfully:', generatedSoap);
        } catch (error: any) {
            console.error('Error generating summary:', error);

            // Show user-friendly error message
            let errorMessage = 'Failed to generate summary';
            if (error?.data?.detail) {
                errorMessage = error.data.detail;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleEndConsultation = async () => {
        if (!consultationId) return;

        try {
            console.log('Ending consultation...');
            await endConsultation({
                consultation_id: consultationId,
                patient_id: patientId
            }).unwrap();

            setIsConsultationEnded(true);
            console.log('Consultation ended successfully');
        } catch (error) {
            console.error('Error ending consultation:', error);
        }
    };

    const latestTranscriptForSuggestion = (
        currentTranscription.trim() || transcriptions[transcriptions.length - 1]?.content || ''
    ).trim();

    const liveSuggestionText = latestTranscriptForSuggestion
        ? `Suggestion: Ask a focused follow-up to clarify "${latestTranscriptForSuggestion.slice(0, 100)}${latestTranscriptForSuggestion.length > 100 ? '...' : ''}".`
        : 'Suggestion: Continue speaking clearly. A real-time suggestion will appear as transcription updates.';

    return (
        <div className='flex flex-col gap-[20px] bg-white rounded-[28px] border border-[#FAFAFA] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] p-8'>
            <Breadcrumb items={[
                { label: 'Home' },
                { label: sourcePage, path: sourcePath },
                { label: 'Patient Details', path: `/patient/${patientId}` },
                { label: 'Consultation Session', isActive: true }
            ]} />

            {/* Header */}


            {/* Main Content Area */}
            <div className="flex flex-col gap-6">
                {/* Recording Controls */}
                <div className="flex flex-col items-center gap-4 flex-shrink-0">
                    {/* Microphone / Playback Button */}
                    {audioPlaybackUrl && !isRecording ? (
                        <>
                            <button
                                onClick={handleAudioPlaybackToggle}
                                className="w-[120px] h-[120px] p-[10px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg bg-[#F4F5F6] hover:bg-[#E5E7EB]"
                            >
                                {isAudioPlaying ? (
                                    <Pause className="w-8 h-8 text-[#080E0D]" strokeWidth={2} />
                                ) : (
                                    <Play className="w-8 h-8 text-[#080E0D]" strokeWidth={2} />
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isUploadingAudio}
                            className={`w-[120px] h-[120px] p-[10px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isRecording
                                ? 'bg-[#E74C3C] hover:bg-[#C0392B]'
                                : 'bg-[#F4F5F6] hover:bg-[#F4F5F6]'
                                }`}
                        >
                            {isRecording ? (
                                <Square className="w-8 h-8 text-white" strokeWidth={2} />
                            ) : (
                                <img src={microphone} alt='microphone' className='w-[60px] h-[60px]' />
                            )}
                        </button>
                    )}

                    <p className="font-mulish text-[14px] text-[#7A7A7A] text-center">
                        {isUploadingAudio
                            ? 'Uploading audio...'
                            : audioPlaybackUrl && !isRecording
                                ? (isAudioPlaying ? 'Playing recorded audio' : 'Recorded audio ready. Click to play')
                                : isRecording
                                    ? 'Recording... Click to stop'
                                    : 'Click to start recording'}
                    </p>

                    {isUploadingAudio && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                            <p className="font-mulish text-[13px] text-[#1D4ED8]">Uploading audio and transcript...</p>
                        </div>
                    )}

                    {/* Recording Waveform */}
                    {isRecording && (
                        <div className="w-full flex items-center justify-center gap-1 h-12">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-[#418BF5] rounded-full transition-all duration-100"
                                    style={{
                                        height: `${Math.max(4, (audioLevel * 40) + (Math.random() * 10))}px`,
                                        animationDelay: `${i * 20}ms`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Generate Summary Button */}
                    {hasRecorded && !isRecording && (
                        <button
                            onClick={generateSummary}
                            disabled={isUploadingAudio}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-xl font-satoshi font-semibold text-[14px] "
                        >
                            {/* <Sparkles className="w-5 h-5" strokeWidth={2} /> */}
                            {isUploadingAudio ? 'Please wait...' : 'Generate Summary'}
                        </button>
                    )}
                </div>

                {/* AI Summary Section */}
                <div className="bg-white rounded-[20px] p-6 border border-[#E5E7EB] flex flex-col">
                    <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-blue-500" strokeWidth={2} />
                        <h3 className="font-satoshi font-bold text-[18px] text-[#080E0D]">
                            AI Summary
                        </h3>
                    </div>

                    {generatedSummary ? (
                        <div className="space-y-5">
                            {([
                                { label: 'Subjective', key: 'subjective' },
                                { label: 'Objective', key: 'objective' },
                                { label: 'Assessment', key: 'assessment' },
                                { label: 'Plan', key: 'plan' },
                            ] as { label: string; key: keyof SoapNote }[]).map(({ label, key }) => (
                                <div key={key}>
                                    <h4 className="font-satoshi font-bold text-[14px] text-[#418BF5] uppercase tracking-wide mb-1">
                                        {label}
                                    </h4>
                                    <p className="font-satoshi text-[14px] text-[#080E0D] leading-relaxed">
                                        {generatedSummary[key] as string}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : transcriptions.length === 0 && !currentTranscription && !isRecording ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <img src={Notetext} className='w-[177px] h-[149px]' />
                            <p className="font-mulish text-[16px] text-[#7A7A7A] max-w-md">
                                Nothing to summarize yet. Start a recording session and we'll generate the transcript and summary for you.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                            <div className="space-y-4 flex-1">
                                {isRecording && transcriptions.length === 0 && !currentTranscription && (
                                    <div className="mb-4">
                                        <p className="font-satoshi text-[14px] text-[#7A7A7A] leading-relaxed italic">
                                            Listening... your live transcript will appear here.
                                        </p>
                                    </div>
                                )}

                                {/* Current transcription (interim results) */}
                                {currentTranscription && (
                                    <div className="mb-4">
                                        <p className="font-satoshi text-[14px] text-[#7A7A7A] leading-relaxed italic">
                                            {currentTranscription}
                                        </p>
                                    </div>
                                )}

                                {/* Final transcriptions */}
                                {transcriptions.map((entry) => (
                                    <div key={entry.id} className="mb-4">
                                        <p className="font-satoshi text-[14px] text-[#080E0D] leading-relaxed">
                                            {entry.content}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {isRecording && (
                                <div className="w-full lg:max-w-[300px] rounded-xl border border-[#D9E4F9] bg-white p-4 shadow-[0px_10px_25px_rgba(8,14,13,0.08)]">
                                    <h4 className="font-satoshi font-bold text-[14px] text-[#080E0D] mb-2">
                                        Suggestion
                                    </h4>
                                    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3">
                                        <p className="font-mulish text-[13px] text-[#334155] leading-relaxed">
                                            {liveSuggestionText}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Note Input */}
                <div className="flex gap-3 flex-shrink-0">
                    <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Something..."
                        className="flex-1 p-4 border border-[#EDEDED] rounded-xl font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none focus:border-[#418BF5] focus:ring-1 focus:ring-[#418BF5] transition-all bg-[#F2F2F2]"
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={!noteInput.trim()}
                        className={`p-4 rounded-xl transition-colors ${noteInput.trim()
                            ? 'bg-[#418BF5] hover:bg-[#3A7BD5] text-white'
                            : 'bg-[#BCBCBC] cursor-not-allowed text-white'
                            }`}
                    >
                        <Send className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
}