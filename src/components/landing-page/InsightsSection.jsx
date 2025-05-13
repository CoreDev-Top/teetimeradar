import React, { useState, useEffect } from 'react'
import GolfPlayers from '../../assets/images/golf-players.svg'
import Blob from '../../assets/images/blob.svg'

const InsightsSection = () => {
    const [mobile, setMobile] = useState(false)
    useEffect(() => {
        if (window.innerWidth < 1200) {
            setMobile(true)
        } else {
            setMobile(false)
        }
    }, [])
    return (
        <div>
            <div
                style={{
                    background: 'white',
                    paddingBlock: mobile ? '0px' : '150px',
                }}
            >
                <img src={Blob} alt="blob" className="insights-blob" />

                <div className="insights-wrapper">
                    <div>
                        <img
                            src={GolfPlayers}
                            alt="golf players"
                            style={{
                                width: '90%',
                                maxWidth: '1200px',
                                height: 'auto',
                                position: 'relative',
                                zIndex: '1',
                                margin: 'auto',
                            }}
                        />
                    </div>
                    <div style={{ width: '90%', maxWidth: '700px' }}>
                        <div
                            className=" alert-title "
                            style={{
                                color: 'rgba(44, 60, 85, 1)',
                                paddingBlock: '25px',
                            }}
                        >
                            {' '}
                            Featured Course{' '}
                        </div>

                        <div
                            className="alert-description"
                            dangerouslySetInnerHTML={{
                                __html: `Working with the head pro at one of the most popular courses in San Diego, we found that there were nearly 60 cancellations on average per DAY!!
       
       Most golf courses don’t penalize you for cancelling as long as you let them know 24-48 hours in advance, so golfers take advantage of this policy by proactively booking but cancelling the week of as their plans change.
    
       When looking at the data, we found that 50% of the time it was just one spot canceling, 20% of the time it was 2 slots, 3% of the time it was 3 slots and 27% of the time the entire foursome cancelled.
`.replace(/\n/g, '<br />'),
                            }}
                        />
                    </div>
                </div>
            </div>
            <div
                style={{
                    height: '50px',
                    background: 'white',
                    borderBottomRightRadius: '100%',
                    borderBottomLeftRadius: '100%',
                }}
            />
        </div>
    )
}

export default InsightsSection
