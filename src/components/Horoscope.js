import Spinner from './Spinner';

const Horoscope = ({zodiac, horoscope, loading}) => {
    if (!zodiac) {
        return null;
    }

    return (
        <>
            {
            loading ? (<div>...</div>) : (zodiac && (
                <div className="zodiac">
                    <img src={zodiac.icon} className="zodiac__icon"/>
                    <h2 className="zodiac__title">{zodiac.sign}</h2>
                    <div className="zodiac__period">{zodiac.period}</div>
                    <div className="zodiac__horoscope">{horoscope}</div>
                </div>
              ))
            }
        </>
        
    )
}

export default Horoscope;

