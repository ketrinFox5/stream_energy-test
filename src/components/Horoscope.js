import { useSwipeable } from 'react-swipeable'

const Horoscope = ({zodiac, horoscope, loading, onBack}) => {
    const swipeHandlers = useSwipeable({
        onSwipedRight: onBack,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    if (!zodiac) {
        return null;
    }

    return (
        <>
            {
            loading ? (<div className="spinner"></div>) : (zodiac && (
                <div className="zodiac" {...swipeHandlers}>
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

