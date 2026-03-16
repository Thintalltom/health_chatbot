import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Mic, Square, Send, Stethoscope, Brain, Sparkles } from 'lucide-react';
import microphone from '../assets/svgs/microphone-2.svg'
import Notetext from '../assets/svgs/Notext.svg'
interface TranscriptionEntry {
    id: number;
    type: 'voice' | 'note';
    content: string;
    timestamp: string;
}

export function ConsultationSession() {
    const { id } = useParams();
    const location = useLocation();
    const [isRecording, setIsRecording] = useState(false);
    const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
    const [noteInput, setNoteInput] = useState('');
    const [currentTranscription, setCurrentTranscription] = useState('');
    const [hasRecorded, setHasRecorded] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number>();

    // Determine the source page from the location state or referrer
    const isFromScheduledPatients = location.state?.from === 'scheduled' ||
        location.pathname.includes('scheduled') ||
        window.document.referrer.includes('scheduled');

    const sourcePage = isFromScheduledPatients ? 'Scheduled Patients' : 'All Patients';
    const sourcePath = isFromScheduledPatients ? '/patientTable?tab=scheduled' : '/patientTable?tab=all';

    // Initialize speech recognition
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
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            // Set up audio analysis for waveform
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setHasRecorded(true);

            // Start audio level monitoring
            monitorAudioLevel();

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

    const generateSummary = () => {
        // Placeholder for AI summary generation
        console.log('Generating AI summary...');
    };

    return (
        <div className='flex flex-col gap-[20px] bg-white rounded-[28px] border border-[#FAFAFA] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] p-8'>
            <Breadcrumb items={[
                { label: 'Home' },
                { label: sourcePage, path: sourcePath },
                { label: 'Patient Details', path: `/patient/${id}` },
                { label: 'Consultation Session', isActive: true }
            ]} />

            {/* Header */}


            {/* Main Content Area */}
            <div className="flex flex-col gap-6">
                {/* Recording Controls */}
                <div className="flex flex-col items-center gap-4 flex-shrink-0">
                    {/* Microphone Button */}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
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

                    <p className="font-mulish text-[14px] text-[#7A7A7A] text-center">
                        {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                    </p>

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
                    {hasRecorded && !isRecording && transcriptions.length > 0 && (
                        <button
                            onClick={generateSummary}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-500 text-blue-500 rounded-xl font-satoshi font-semibold text-[14px] "
                        >
                            {/* <Sparkles className="w-5 h-5" strokeWidth={2} /> */}
                            Generate Summary
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

                    {transcriptions.length === 0 && !currentTranscription ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <img src={Notetext} className='w-[177px] h-[149px]' />
                            <p className="font-mulish text-[16px] text-[#7A7A7A] max-w-md">
                                Nothing to summarize yet. Start a recording session and we'll generate the transcript and summary for you.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
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