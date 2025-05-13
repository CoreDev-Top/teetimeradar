import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeroIllustration from '../../assets/images/hero.svg'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div style={{ background: 'white', paddingBottom: '75px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: '90%',
                        maxWidth: '2000px',
                        margin: 'auto',
                        paddingTop: '60px',
                    }}
                    className="flex-col-reverse xl:flex-row hero-section-mobile"
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            height: '440px',
                            width: '90%',
                            maxWidth: '550px',
                        }}
                    >
                        <div className=" hero-title ">
                            {' '}
                            Get Alerted When Tee Times Cancel{' '}
                        </div>
                        <div className="hero-description">
                            Struggling to get tee times? We’re here to fix that.
                            No more excessive planning, waiting up till
                            midnight, or obsessively refreshing tee sheets.
                        </div>
                        <div>
                            <button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out justify-center"
                                style={{
                                    padding: '14px 28px',
                                    width: '252px',
                                    height: '52px',
                                    borderRadius: '12px',
                                    color: '#F5F8FD',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    lineHeight: '150%',
                                }}
                                onClick={() => {
                                    navigate('/join')
                                }}
                            >
                                SET UP ALERT NOW
                            </button>
                            <p
                                className="text-gray-800 mt-6 "
                                style={{ color: 'rgb(113, 131, 165)' }}
                            >
                                Already a member?{' '}
                                <a
                                    href="#!"
                                    className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>

                    <img
                        src={HeroIllustration}
                        alt="hero"
                        style={{
                            width: '90%',
                            maxWidth: '500px',
                            maxHeight: '50%',
                        }}
                    />
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

export default HeroSection
