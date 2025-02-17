import { createContext, useState, useEffect, useRef } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const timeoutIds = useRef([]);

    useEffect(() => {
        return () => {
            timeoutIds.current.forEach(clearTimeout);
            timeoutIds.current = [];
        };
    }, []);

    const processResponse = (response) => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];

        const formattedResponse = response
            .split('**')
            .map((segment, index) => (index % 2 ? `<b>${segment}</b>` : segment))
            .join('')
            .replace(/\*/g, '<br/>');

        let words = formattedResponse.split(/(\s+)/).filter(word => word.length > 0);

        if (words.length > 1 && words[0].trim() === words[1].trim()) {
            words.shift();
        }

        words.forEach((word, index) => {
            const timeoutId = setTimeout(() => {
                setResultData(prev => prev + word);
            }, 75 * index);
            timeoutIds.current.push(timeoutId);
        });
    };

    const onSent = async (prompt) => {
        try {
            setResultData("");
            setLoading(true);
            setShowResult(true);
            
            const currentPrompt = prompt || input;
            if (!currentPrompt.trim()) return;

            setPrevPrompts(prev => [...prev, currentPrompt]);
            setRecentPrompt(currentPrompt);

            const response = await runChat(currentPrompt);
            
            processResponse(response);
            
            setInput("");
        } catch (error) {
            console.error("Chat Error:", error);
            setPrevPrompts(prev => prev.slice(0, -1));
            setResultData("Error processing your request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const newChat = () => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        setInput("");
        setRecentPrompt("");
        setPrevPrompts([]);
        setShowResult(false);
        setResultData("");
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
