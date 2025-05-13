import React from 'react'
import TipsIcon1 from '../../assets/images/tips-1.svg'
import TipsIcon2 from '../../assets/images/tips-2.svg'
import TipsIcon3 from '../../assets/images/tips-3.svg'

const TipsSection = () => {
    const tips = [
        {
            title: 'Plan Ahead',
            description:
                'Set up your alerts at least a few days ahead. Most tee times become available in the last 24-48 hours.',
            image: TipsIcon1,
        },
        {
            title: 'Be Flexible',
            description:
                'Create alerts for multiple courses, limit your group size to 2 or less and setyour window for multiple hours. You’ll get more alerts this way.',
            image: TipsIcon2,
        },
        {
            title: 'Book Fast',
            description:
                'Be quick with those fingers. Most tee times are gone within 5-10 minutes',
            image: TipsIcon3,
        },
    ]
    return (
        <div>
            <div
                className=" alert-title "
                style={{
                    width: 'fit-content',
                    margin: 'auto',
                    paddingBlock: '75px',
                }}
            >
                {' '}
                Quick Tips{' '}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {tips.map((tip, index) => (
                    <div
                        key={index}
                        className="block p-8 pb-12 rounded-xl shadow-lg  bg-white"
                        style={{
                            minWidth: '300px',
                            width: '30%',
                            maxWidth: '600px',
                            margin: '20px',
                        }}
                    >
                        <img
                            src={tip.image}
                            alt="tips"
                            style={{ width: '70px', height: '70px' }}
                        />
                        <div
                            className=" alert-title "
                            style={{ fontSize: '28px' }}
                        >
                            {tip.title}
                        </div>
                        <div className="alert-description">
                            {tip.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TipsSection
