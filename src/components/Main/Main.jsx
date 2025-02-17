import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets';
import { Context } from '../../context/Context';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const [error, setError] = useState(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        if (searchBoxRef.current) {
            console.log("Search box element exists:", searchBoxRef.current);
        } else {
            console.error("Search box element is null!");
        }
    }, []);

    const handleSend = async () => {
        if (input.trim() === "") {
            setError("Please enter a valid prompt.");
            return;
        }

        try {
            await onSent(input);
            setInput(""); 
            setError(null); 
        } catch (err) {
            setError("Failed to send the prompt. Please try again.");
            console.error("Error in handleSend:", err);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.user_icon} alt="User Icon" />
            </div>

            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Evan.</span></p>
                            <p>How can I assist you today?</p>
                        </div>

                        <div className="cards">
                            {[ 
                                { text: "Suggest beautiful car museums to see on an upcoming road trip", icon: assets.compass_icon },
                                { text: "Briefly summarize this concept: automobile engineering", icon: assets.bulb_icon },
                                { text: "Brainstorm team bonding activities for our work retreat", icon: assets.message_icon },
                                { text: "Improve the readability of the following code", icon: assets.code_icon },
                            ].map((item, index) => (
                                <div key={index} className="card" onClick={() => onSent(item.text)}>
                                    <p>{item.text}</p>
                                    <img src={item.icon} alt="Card Icon" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box" ref={searchBoxRef}>
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder='Enter a prompt here...' 
                            onKeyDown={handleKeyDown}
                        />
                        <div onClick={handleSend} style={{ cursor: "pointer" }}>
                            <img src={assets.gallery_icon} alt="Gallery Icon" />
                            <img src={assets.mic_icon} alt="Mic Icon" />
                            {input?<img onClick={handleSend} src={assets.send_icon} alt="Send Icon" />:null}
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
