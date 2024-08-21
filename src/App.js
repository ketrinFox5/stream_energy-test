import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [userLanguage, setUserLanguage] = useState('en'); // По умолчанию английский язык
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
  return (
    <div className="App">
      <h1>{texts[userLanguage]?.welcome || texts['en'].welcome}</h1>
      <button onClick={() => window.Telegram.WebApp.close()}>
        {texts[userLanguage]?.closeButton || texts['en'].closeButton}
      </button>
    </div>
  );
}
export default App;