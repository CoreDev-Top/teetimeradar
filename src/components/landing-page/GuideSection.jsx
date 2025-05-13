import React, { useEffect, useState } from 'react'
import Guide1 from '../../assets/images/guide-1.svg'
import Guide2 from '../../assets/images/guide-2.svg'
import Guide3 from '../../assets/images/guide-3.svg'
import Guide4 from '../../assets/images/guide-4.svg'
import DashedLine1 from '../../assets/images/dashed-line-1.svg'
import DashedLine2 from '../../assets/images/dashed-line-2.svg'
import DashedLine3 from '../../assets/images/dashed-line-3.svg'

const GuideSection = () => {
    const guideSteps = [
        {
            title: 'Insert Preferences',
            description:
                'Insert your booking preferences (course, date, time, group size)',
            image: Guide1,
        },
        {
            title: 'We’ll Start Looking',
            description:
                'We will constantly crawl the tee sheets at your desired courses waiting for cancellations.',
            image: Guide2,
        },
        {
            title: 'Get Alerted',
            description:
                'Once a tee time becomes available, we’ll text you right away with a link to book.',
            image: Guide3,
        },
        {
            title: 'Book Tee Time',
            description:
                'Most tee times are snagged within minutes so book as quickly as possible.',
            image: Guide4,
        },
    ]
    // are we in resolution less than 1200px or not ?
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
                    height: '50px',
                    background: 'white',
                    borderTopRightRadius: '100%',
                    borderTopLeftRadius: '100%',
                }}
            />

            <div style={{ background: 'white', paddingBottom: '75px' }}>
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
                        How It Works{' '}
                    </div>

                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                width: '90%',
                                maxWidth: '1400px',
                                margin: 'auto',
                                paddingTop: '60px',
                                height: 'fit-content',
                            }}
                            className="flex-col-reverse xl:flex-row hero-section-mobile guide-section"
                        >
                            <img
                                src={guideSteps[0].image}
                                alt="How it works"
                                style={{
                                    width: '90%',
                                    maxWidth: '400px',
                                    maxHeight: '30%',
                                    position: 'relative',
                                    zIndex: '1',
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        className="guide-numbering"
                                        style={{
                                            marginLeft: '0px',
                                            marginRight: '-1px',
                                        }}
                                    >
                                        01
                                    </div>

                                    <div
                                        className=" alert-title "
                                        style={{
                                            fontSize: '32px',
                                            marginLeft: '-15px',
                                            marginBottom: '-15px',
                                        }}
                                    >
                                        {' '}
                                        {guideSteps[0].title}{' '}
                                    </div>
                                </div>
                                <div className=" guide-description">
                                    {guideSteps[0].description}
                                </div>
                            </div>
                        </div>

                        <img
                            src={DashedLine1}
                            className="dashed-line"
                            alt="Dashed line"
                            style={{
                                objectFit: 'cover',
                                maxHeight: '397px',
                                marginTop: '-110px',
                                transform: 'rotate(356deg)',
                                maxWidth: '656px',
                            }}
                        />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                width: '90%',
                                maxWidth: '1400px',
                                margin: 'auto',
                                paddingTop: '60px',
                                height: 'fit-content',
                                flexDirection: 'row-reverse',
                            }}
                            className="flex-col-reverse xl:flex-row hero-section-mobile guide-section"
                        >
                            <img
                                src={guideSteps[1].image}
                                alt="How it works"
                                style={{
                                    width: '90%',
                                    maxWidth: '400px',
                                    maxHeight: '30%',
                                    position: 'relative',
                                    zIndex: '1',
                                    marginTop: mobile && '40px',
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div className="guide-numbering">02</div>

                                    <div
                                        className=" alert-title "
                                        style={{
                                            fontSize: '32px',
                                            marginLeft: '-15px',
                                            marginBottom: '-15px',
                                        }}
                                    >
                                        {' '}
                                        {guideSteps[1].title}{' '}
                                    </div>
                                </div>
                                <div className=" guide-description">
                                    {guideSteps[1].description}
                                </div>
                            </div>
                        </div>
                        <img
                            src={DashedLine2}
                            className="dashed-line"
                            alt="Dashed line"
                            style={{
                                transform: 'rotate(175deg)',
                                maxWidth: '826px',
                                maxHeight: '448px',
                                objectFit: 'cover',
                                marginTop: '-241px',
                            }}
                        />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                width: '90%',
                                maxWidth: '1400px',
                                margin: 'auto',
                                paddingTop: '60px',
                                height: 'fit-content',
                            }}
                            className="flex-col-reverse xl:flex-row hero-section-mobile guide-section"
                        >
                            <img
                                src={guideSteps[2].image}
                                alt="How it works"
                                style={{
                                    width: '90%',
                                    maxWidth: '400px',
                                    maxHeight: '30%',
                                    position: 'relative',
                                    zIndex: '1',
                                    marginTop: mobile && '40px',
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div className="guide-numbering">03</div>

                                    <div
                                        className=" alert-title "
                                        style={{
                                            fontSize: '32px',
                                            marginLeft: '-15px',
                                            marginBottom: '-15px',
                                        }}
                                    >
                                        {' '}
                                        {guideSteps[2].title}{' '}
                                    </div>
                                </div>
                                <div className=" guide-description">
                                    {guideSteps[2].description}
                                </div>
                            </div>
                        </div>

                        <img
                            src={DashedLine3}
                            className="dashed-line"
                            alt="Dashed line"
                            style={{
                                marginTop: '-121px',
                                maxWidth: '681px',
                                transform: 'rotate(6deg)',
                                objectFit: 'cover',
                                maxHeight: '268px',
                            }}
                        />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                width: '90%',
                                maxWidth: '1400px',
                                margin: 'auto',
                                paddingTop: '60px',
                                height: 'fit-content',
                                flexDirection: 'row-reverse',
                            }}
                            className="flex-col-reverse xl:flex-row hero-section-mobile guide-section"
                        >
                            <img
                                src={guideSteps[3].image}
                                alt="How it works"
                                style={{
                                    width: '90%',
                                    maxWidth: '400px',
                                    maxHeight: '30%',
                                    position: 'relative',
                                    zIndex: '1',
                                    marginTop: mobile && '40px',
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div className="guide-numbering">04</div>

                                    <div
                                        className=" alert-title "
                                        style={{
                                            fontSize: '32px',
                                            marginLeft: '-15px',
                                            marginBottom: '-15px',
                                        }}
                                    >
                                        {' '}
                                        {guideSteps[3].title}{' '}
                                    </div>
                                </div>
                                <div className=" guide-description">
                                    {guideSteps[3].description}
                                </div>
                            </div>
                        </div>
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

export default GuideSection
