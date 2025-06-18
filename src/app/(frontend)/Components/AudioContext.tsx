import { createContext, useContext, useRef } from "react";
import zillaGao from "./zillaGao";

const ErrorAudioContext = createContext<{ playErrorSound: () => void } | undefined>(undefined);

export const ErrorAudioProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const playErrorSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.warn("Audio error:", err));
        }
    };

    return (
        <ErrorAudioContext.Provider value={{ playErrorSound }}>
            {children}
            <audio ref={audioRef} src={zillaGao} preload="auto" />
        </ErrorAudioContext.Provider>
    );
};

export const useErrorAudio = () => {
    const context = useContext(ErrorAudioContext);
    if (!context) throw new Error("useErrorAudio must be used within ErrorAudioProvider");
    return context;
};
