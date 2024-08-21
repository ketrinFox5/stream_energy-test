import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [userLanguage, setUserLanguage] = useState('en'); // По умолчанию английский язык
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Получаем язык, установленный в Telegram
    const languageCode = tg.initDataUnsafe?.user?.language_code || 'en'; // Если язык не доступен, используем 'en'

      // Если язык в Telegram - русский ('ru'), ставим русский, иначе английский
      if (languageCode === 'ru') {
        setUserLanguage('ru');
      } else {
        setUserLanguage('en');
      }

    console.log('User data:', tg.initDataUnsafe.user); // Пример получения данных о пользователе
  }, []);

  // Пример текстов на разных языках
  const texts = {
    en: {
      welcome: 'Welcome to My Telegram MiniApp!',
      closeButton: 'Close MiniApp'
    },
    ru: {
      welcome: 'Добро пожаловать в My Telegram MiniApp!',
      closeButton: 'Закрыть MiniApp'
    }
  };

  const zodiacList = [
    {
        sign: "aries",
        language: userLanguage === 'ru' ? 'original' : 'translated',
        period: "March 21 - April 19",
        // time: 'March 21 - April 19'
    },
    {
        sign: "taurus",
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: "April 20 - May 20"
    },
    { 
        sign: 'gemini',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'May 21 - June 20', 
    },
    { 
        sign: 'cancer',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'June 21 - July 22', 
    },
    { 
        sign: 'leo',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'July 23 - August 22', 
    },
    { 
        sign: 'virgo',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'August 23 - September 22', 
    },
    { 
        sign: 'libra',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'September 23 - October 22', 
    },
    { 
        sign: 'scorpio',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'October 23 - November 21', 
    },
    { 
        sign: 'sagittarius',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'November 22 - December 21', 
    },
    { 
        sign: 'capricorn',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'December 22 - January 19', 
    },
    { 
        sign: 'aquarius',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'January 20 - February 18', 
    },
    { 
        sign: 'pisces',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'February 19 - March 20', 
    },
  ];

   // Функция для получения описания знака зодиака через POST запрос
   const fetchZodiacDescription = async (zodiac) => {
    try {
      setLoading(true); // Устанавливаем статус загрузки
      const response = await axios.post('https://poker247tech.ru/get_horoscope/', {
        sign: zodiac.sign,
        language: zodiac.language,
        period: "today"
      });
      console.log(response.data)
      setDescription(response.data.horoscope); 
      console.log(description)// Устанавливаем описание
    } catch (error) {
      console.error('Error fetching zodiac horoscope:', error);
      setDescription('Не удалось загрузить гороскоп.');
    } finally {
      setLoading(false); // Завершаем загрузку
    }
  };

  // Обработчик клика по знаку зодиака
  const handleZodiacClick = (zodiac) => {
    setSelectedZodiac(zodiac);
    fetchZodiacDescription(zodiac);
  };

  return (
    <div className="App">
      <h1>{texts[userLanguage]?.welcome || texts['en'].welcome}</h1>
      <button onClick={() => window.Telegram.WebApp.close()}>
        {texts[userLanguage]?.closeButton || texts['en'].closeButton}
      </button>
      <div>
        {zodiacList.map(zodiac => (
          <div onClick={()=> handleZodiacClick(zodiac)}>
            <h2>{zodiac.sign}</h2>
            <div>
              {zodiac.period}
            </div>
          </div>
        ))}
      </div>
      {
        loading ? (<div>Загрузка...</div>) : (selectedZodiac && (
          <div>
             <h2>{selectedZodiac.sign}</h2>
            <p>Период: {selectedZodiac.period}</p>
            <p>{description}</p>
          </div>
        ))
      }
    </div>
  );
}
export default App;