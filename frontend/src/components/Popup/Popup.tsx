import React, { useEffect, useState } from 'react';
import styles from './Popup.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PopupProps {
  message: string;
  onClose: () => void;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_APIKEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function formatResponseText(text: any) {
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/•/g, '<li>');
}

async function checkForFraud(message: string) {
  const prompt = `I want to know why this message could be a fraud: ${message}`;
  const result = await model.generateContent(prompt);
  const res = formatResponseText(result.response.text());

  window.speechSynthesis.cancel();

  let cleanedRes = res.replace(/<[^>]*>/g, '');  // Remove <br/> tags
  cleanedRes = cleanedRes.replace(/\*/g, '');          // Remove asterisks

  let speech = new SpeechSynthesisUtterance();
  speech.text = cleanedRes;  // Use the cleaned copy
  speech.lang = 'en-US';     // Set language to American English
  speech.voice = null;

  console.log(cleanedRes);
  console.log(speech);
  window.speechSynthesis.speak(speech);

  return res;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  const [fraudInfo, setFraudInfo] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  const handleMoreInfoClick = () => {
    setIsExpanded(true);
    setShowMoreInfo(true);
  };

  useEffect(() => {
    if (showMoreInfo) {
      checkForFraud(message)
        .then(response => {
          setFraudInfo(response);
        })
        .catch(error => {
          setFraudInfo('Error retrieving fraud information');
          console.error('Error:', error);
        });
    }
  }, [showMoreInfo, message]);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${isExpanded ? styles.popupExpanded : ''}`}>
        <p className='text-black'>{message}</p>
        {showMoreInfo && (
          <div 
            className='text-black' 
            dangerouslySetInnerHTML={{ __html: fraudInfo || 'Loading fraud information...' }}
          />
        )}
        {!showMoreInfo && (
          <button onClick={handleMoreInfoClick} className={styles.closeButton}>More Info</button>
        )}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
