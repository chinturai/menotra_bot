import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    };

    return (
        <div className='sidebar'>
            <div className='top'>
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className='menu' 
                    src={assets.menu_icon} 
                    alt="Menu" 
                    role="button" 
                    aria-label="Toggle menu"
                />
                <div onClick={newChat} className='new-chat' role="button" aria-label="New study session">
                    <img src={assets.plus_icon} alt="New Session" />
                    {extended ? <p>New Session</p> : null}
                </div>
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">Recent Sessions</p>
                        {prevPrompts.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => loadPrompt(item)} 
                                className="recent-entry"
                                role="button"
                                aria-label={`Load prompt: ${item.slice(0, 18)}`}
                            >
                                <img src={assets.message_icon} alt="Message Icon" />
                                <p>{item.slice(0, 18)}...</p>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry" role="button" aria-label="Study Resources">
                    <img src={assets.question_icon} alt="Resources Icon" />
                    {extended ? <p>Resources</p> : null}
                </div>
                <div className="bottom-item recent-entry" role="button" aria-label="Study History">
                    <img src={assets.history_icon} alt="History Icon" />
                    {extended ? <p>History</p> : null}
                </div>
                <div className="bottom-item recent-entry" role="button" aria-label="Settings">
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;