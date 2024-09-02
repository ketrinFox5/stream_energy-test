import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Horoscope from './components/Horoscope';
import './App.css';
import { zodiacListEn, zodiacListRu } from './const/zodiacList';

function App() {
  const [language, setLanguage] = useState('en');
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [zodiacList, setZodiacList] = useState(zodiacListEn);
  const [zodiacId, setZodiacId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    tg.ready();

    const languageCode = tg.initDataUnsafe?.user?.language_code || 'en';

      if (languageCode === 'ru') {
        setLanguage('ru');
        setZodiacList(zodiacListRu);
      } else {
        setLanguage('en');
        setZodiacList(zodiacListEn);
      }
  }, []);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    if (view === 'description') {
      tg.BackButton.show();
      tg.BackButton.onClick(handleBackClick);
    } else {
      tg.BackButton.hide();
    }

    return () => {
      tg.BackButton.offClick(handleBackClick);
    };
  }, [view]);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    tg.onEvent('viewport_changed', (viewport) => {
      setIsExpanded(viewport.isExpanded);
    });

    return () => {
      tg.offEvent('viewport_changed');
    };
  }, []);

  useEffect(() => {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.style.height = isExpanded ? '100vh' : '50vh';
    }
  }, [isExpanded]);

  const translations = {
    en: {
      title: 'Find out your destiny for today!',
      back: 'Back'
    },
    ru: {
      title: 'Узнай свою судьбу на сегодня!',
      back: 'Назад'
    }
  };

  const currentTranslations = translations[language];

  const fetchZodiacDescription = async (zodiacId) => {
    try {
      setLoading(true);
      const response = await axios.post('https://poker247tech.ru/get_horoscope/', {
        sign: zodiacId,
        language: language === 'ru' ? 'original' : 'transleted',
        period: "today"
      });
      setDescription(response.data.horoscope); 
    } catch (error) {
      console.error('Error fetching zodiac horoscope:', error);
      setDescription('Не удалось загрузить гороскоп.');
    } finally {
      setLoading(false);
    }
  };

  const handleZodiacClick = (zodiacId) => {
    setZodiacId(zodiacId);
    setView('description');
    fetchZodiacDescription(zodiacId);
  };

  const handleBackClick = () => {
    setSelectedZodiac(null);
    setDescription('');
    setView('list');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    lang === 'ru' ? setZodiacList(zodiacListRu) : setZodiacList(zodiacListEn);
  };

  useEffect(() => {
    if (selectedZodiac) {
      fetchZodiacDescription(selectedZodiac, language);
    }
  }, [language]);

  useEffect(() => {
    const zodiac = zodiacList.find(z => zodiacId === z.id);
    setSelectedZodiac(zodiac);
  }, [zodiacList, zodiacId]);

  return (
    <div className="App" id="app-container">
      <div className="header">
        <div className="language__switcher">
          <button onClick={() => handleLanguageChange('en')} className="language__btn">
            English
          </button>
          <button onClick={() => handleLanguageChange('ru')} className="language__btn" >
            Русский
          </button>
        </div>
        <h1>{currentTranslations.title}</h1>
      </div>
      
      {view === 'list' && (
        <div className="zodiacs">
          {zodiacList.map(zodiac => (
            <div 
                onClick={()=> handleZodiacClick(zodiac.id)}
                key={zodiac.id}
                className="zodiac"
            >
                <img src={zodiac.icon} className="zodiac__icon"/>
                <h2 className="zodiac__title">
                  {zodiac.sign}
                </h2>
                <div className="zodiac__period">
                  {zodiac.period}
                </div>
            </div>
          ))}
        </div>
      )}
      
      {view === 'description' && (
        <Horoscope
          zodiac={selectedZodiac}
          horoscope={description}
          loading={loading}
          onBack={handleBackClick}
        />
      )}
    </div>
  );
}
export default App;