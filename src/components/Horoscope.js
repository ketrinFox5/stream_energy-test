const Horoscope = ({zodiac, horoscope, loading}) => {
    if (!zodiac) {
        return null;
    }

    return (
        <>
            {
            loading ? (<div>Загрузка...</div>) : (zodiac && (
                <div>
                   <h2>{zodiac.sign}</h2>
                  <p>Период: {zodiac.period}</p>
                  <p>Ваш гороскоп на сегодня: {horoscope}</p>
                </div>
              ))
            }
        </>
        
    )
}

export default Horoscope;

