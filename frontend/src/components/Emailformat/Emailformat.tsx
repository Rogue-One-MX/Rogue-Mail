import React, { useState, useEffect } from 'react';
import {Popup} from "@/components/Popup";
import styles from './Emailformat.module.css';

interface Email {
  id: string;
  sender: string;
  subject: string;
  date: string;
  category: string;
  fraud?: boolean;
}

const Emailformat: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const [emails, setEmails] = useState<Email[]>([
    {id:'one', sender: 'Facebook', subject: '27 new notifications', date: '11:08 AM', category: 'Social' },
    {id:'two', sender: 'Elena Casarosa', subject: "Let's have dinner on Sunday", date: 'Sep 27', category: 'Primary' },
    {id:'three', sender: 'Spam Alert', subject: 'You owe us a millions dollars', date: 'Sep 25', category: 'Promotions'},
    {id:'four', sender: 'Unknown Sender', subject: 'Happy birthday grandma', date: 'Sep 24', category: 'Updates'},
    {id:'five', sender: 'jfillory', subject: 'The Littlest Toad Feedback', date: 'Sep 18', category: 'Updates' },
    {id:'six', sender: 'no-reply', subject: 'Im a prince and need your money give it to me', date: 'Sep 1', category: 'Primary' }
  ]);
  
  const updatedEmails = emails.map(email => {
    return {
        ...email,
        category: email.fraud ? 'Fraud' : email.category // Change category to 'Fraud' if fraud is true
    };
  });

  useEffect(() => {
    // Function to fetch fraud status for a specific email subject
    const fetchFraudStatus = async (subject: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/check_fraud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: subject }), // Send the subject as "text"
            });

            const fraudData = await response.json();
            return fraudData.prediction === 1; // Return true if prediction is 1, false if 0
        } catch (error) {
            console.error(`Error fetching fraud status for "${subject}":`, error);
            return false; // Return false in case of error
        }
    };

    const fetchAllFraudData = async () => {
        const fraudResults = await Promise.all(emails.map(email => fetchFraudStatus(email.subject)));

        // Update emails to include the new "fraud" property
        const updatedEmails = emails.map((email, index) => ({
            ...email,
            fraud: fraudResults[index] // Set fraud to true or false based on API result
        }));

        setEmails(updatedEmails);
    };

    fetchAllFraudData();
  }, []);

  const categories = ["Primary", "Social", "Promotions", "Updates"];

  const handleEmailClick = (email: Email) => {
    if (email.fraud) {
      setPopupMessage("This email is likely a fraud or scam. Avoid clicking on any links or images, and consider deleting it.");
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    window.speechSynthesis.cancel();
    setShowPopup(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Primary':
        return '/primary.png';
      case 'Social':
        return '/social.png';
      case 'Promotions':
        return '/promotion.svg';
      case 'Updates':
        return '/update.svg';
      default:
        return '';
    }
  };

  // Filtrar emails por categoría seleccionada y consulta de búsqueda
  const filteredEmails = emails.filter((email) => {
    const matchesCategory = selectedCategory ? email.category === selectedCategory : true;
    const matchesSearch = email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.emailContainer}>
        {/* Header with Logo, Title, and Search Bar */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/rogue.png" alt="Rogue Logo" className={styles.logo} />
            <span className={styles.title}>Rogue Mail</span>
          </div>
          <div className={styles.searchContainer}>
            <img src="/search.svg" alt="Search Icon" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search mail"
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs with Icons */}
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryTab} ${selectedCategory === category ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <img
                src={getCategoryIcon(category)}
                alt={`${category} Icon`}
                className={styles.categoryIcon}
              />
              {category}
            </button>
          ))}
          <button
            className={`${styles.categoryTab} ${selectedCategory === null ? styles.activeTab : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
        </div>

        {/* Email List */}
        <div className={styles.emailList}>
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`${styles.emailItem} ${email.fraud ? styles.fraudEmail : ''}`}
              onClick={() => handleEmailClick(email)}
            >
              {email.fraud && (
                <img
                  src="/bug.png"
                  alt="Fraud Warning Icon"
                  className={styles.bugIcon}
                />
              )}
              <span className={styles.emailSender}>{email.sender}</span>
              <span className={styles.emailSubject}>{email.subject}</span>
              <span className={styles.emailDate}>{email.date}</span>
            </div>
          ))}
        </div>

        {/* Popup for Fraud Alert */}
        {showPopup && (
          <Popup message={popupMessage} onClose={closePopup} />
        )}
      </div>
    </div>
  );
};

export default Emailformat;
