import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Horoscope from './components/Horoscope';
import './App.css';
import { zodiacListEn, zodiacListRu } from './const/zodiacList';

function App() {
  const [userLanguage, setUserLanguage] = useState('en'); // По умолчанию английский язык
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // Состояние для переключения между списком и карточкой
  const [zodiacList, setZodiacList] = useState(zodiacListEn);
  
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Получаем язык, установленный в Telegram
    const languageCode = tg.initDataUnsafe?.user?.language_code || 'en'; // Если язык не доступен, используем 'en'

      // Если язык в Telegram - русский ('ru'), ставим русский, иначе английский
      if (languageCode === 'ru') {
        setUserLanguage('ru');
        setZodiacList(zodiacListRu);
      } else {
        setUserLanguage('en');
        setZodiacList(zodiacListEn);
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
      welcome: 'Find out your destiny for today!',
      closeButton: 'Close MiniApp'
    },
    ru: {
      welcome: 'Узнай свою судьбу на сегодня!',
      closeButton: 'Закрыть приложение'
    }
  };

  

   // Функция для получения описания знака зодиака через POST запрос
   const fetchZodiacDescription = async (zodiac) => {
    try {
      setLoading(true); // Устанавливаем статус загрузки
      const response = await axios.post('https://poker247tech.ru/get_horoscope/', {
        sign: zodiac.id,
        language: userLanguage === 'ru' ? 'original' : 'transleted',
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
      <div className="header">
      <button className="close__btn" onClick={() => window.Telegram.WebApp.close()}>
        {texts[userLanguage]?.closeButton || texts['en'].closeButton}
      </button>
      <h1>{texts[userLanguage]?.welcome || texts['en'].welcome}</h1>
     
      </div>
      
      {view === 'list' && (
        <div className="zodiacs">
          {zodiacList.map(zodiac => (
            <div 
                onClick={()=> handleZodiacClick(zodiac)}
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
        />
      )}
    </div>
  );
}
export default App;