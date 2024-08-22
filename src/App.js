import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Horoscope from './components/Horoscope';
import './App.css';

function App() {
  const [userLanguage, setUserLanguage] = useState('en'); // По умолчанию английский язык
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // Состояние для переключения между списком и карточкой
  
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

   // Используем useEffect для обработки BackButton
   useEffect(() => {
    const tg = window.Telegram.WebApp;

    if (view === 'description') {
      tg.BackButton.show(); // Показать кнопку "Назад" в интерфейсе Telegram
      tg.BackButton.onClick(handleBackClick); // Назначить обработчик нажатия
    } else {
      tg.BackButton.hide(); // Скрыть кнопку "Назад", когда мы находимся в списке
    }

    // Очищаем обработчик при выходе из компонента или при изменении view
    return () => {
      tg.BackButton.offClick(handleBackClick);
    };
  }, [view]);

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
        id: "aries"
        // time: 'March 21 - April 19'
    },
    {
        sign: "taurus",
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: "April 20 - May 20",
        id: "taurus"
    },
    { 
        sign: 'gemini',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'May 21 - June 20', 
        id: "gemini"
    },
    { 
        sign: 'cancer',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'June 21 - July 22', 
        id: "cancer"
    },
    { 
        sign: 'leo',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'July 23 - August 22', 
        id: "leo"
    },
    { 
        sign: 'virgo',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'August 23 - September 22', 
        id: "virgo"
    },
    { 
        sign: 'libra',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'September 23 - October 22',
        id: "libra" 
    },
    { 
        sign: 'scorpio',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'October 23 - November 21', 
        id: "scorpio" 
    },
    { 
        sign: 'sagittarius',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'November 22 - December 21', 
        id: "sagittarius"
    },
    { 
        sign: 'capricorn',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'December 22 - January 19', 
        id: "capricorn"
    },
    { 
        sign: 'aquarius',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'January 20 - February 18', 
        id: "aquarius"
    },
    { 
        sign: 'pisces',
        language: userLanguage === 'ru' ? 'original' : 'transleted',
        period: 'February 19 - March 20', 
        id: "pisces"
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
      setDescription(response.data.horoscope); 
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
    setView('description'); // Переключаем на просмотр описания
    fetchZodiacDescription(zodiac);
  };

    // Функция для возврата к списку через Telegram BackButton
    const handleBackClick = () => {
      setSelectedZodiac(null);
      setDescription('');
      setView('list'); // Переключаем на просмотр списка
    };

  return (
    <div className="App">
      <h1>{texts[userLanguage]?.welcome || texts['en'].welcome}</h1>
      <button onClick={() => window.Telegram.WebApp.close()}>
        {texts[userLanguage]?.closeButton || texts['en'].closeButton}
      </button>
      {view === 'list' && (
        <div>
          {zodiacList.map(zodiac => (
            <div onClick={()=> handleZodiacClick(zodiac)} key={zodiac.id}>
              <h2>{zodiac.sign}</h2>
              <div>
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
        />
      )}
    </div>
  );
}
export default App;