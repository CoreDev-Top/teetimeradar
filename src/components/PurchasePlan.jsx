import React, { useState, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid'
import useAuth from '../hooks/useAuth'
import JoinModal from './modals/JoinModal'
import LoginModal from './modals/LoginModal'

const PurchasePlan = ({ afterFreeTrial, afterSubscriptionEnd }) => {
    const { userData, loading, token } = useAuth()
    const [idempotencyKey, setIdempotencyKey] = useState(null)

    const [isAnnually, setIsAnnually] = useState(true)

    const handleToggleClick = () => {
        setIsAnnually(!isAnnually)
    }

    const joinModalOpenRef = useRef(null)
    const loginModalOpenRef = useRef(null)

    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
        useState(false)
    if (!idempotencyKey) {
        setIdempotencyKey(uuidv4())
    }

    const HandleBuyClick = async () => {
        setIsCreatingCheckoutSession(true)
        let priceId

        // Flag to control discount activation
        const isYearlyDiscountActive = false // Set to false to deactivate the discount

        if (global.DEV) {
            priceId = isAnnually
                ? isYearlyDiscountActive
                    ? 'price_1ODrlgBSSquRXDH022KWXXMK'
                    : 'price_1N0OVjBSSquRXDH0LFpzbHro'
                : 'price_1N0OVjBSSquRXDH0P1AcJE0k'
        } else {
            priceId = isAnnually
                ? isYearlyDiscountActive
                    ? 'price_1ODrZzBSSquRXDH0JnnCNj0S'
                    : 'price_1OY0A4BSSquRXDH0RXxhXOrY' // 'price_1NJiIoBSSquRXDH0PxGLdhiE'
                : 'price_1OY08VBSSquRXDH0p2cjtTRw' // 'price_1Mz0IQBSSquRXDH0olg3B0Hs'
        }

        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/stripe/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        priceId,
                        userId: userData.id,
                        idempotencyKey,
                    }),
                }
            )

            if (response?.status === 409) {
                if (global.DEV) {
                    window.location.href = 'http://localhost:3000/user'
                } else {
                    window.location.href = 'https://teetimeradar.io/user'
                }
            }

            const { url } = await response.json()
            setIsCreatingCheckoutSession(false)

            if (url) {
                window.location.href = url
            }
        } catch (error) {
            console.error('Failed to create checkout session', error)
        } finally {
            setIsCreatingCheckoutSession(false)
        }
    }

    return (
        <>
            <JoinModal
                joinModalOpenRef={joinModalOpenRef}
                loginModalOpenRef={loginModalOpenRef}
            />
            <LoginModal loginModalOpenRef={loginModalOpenRef} />

            {!loading && (
                <div
                    className="pricing-page pt-20 "
                    style={{ minHeight: '100vh' }}
                >
                    <div className="container-660px-center">
                        <div className="text-center">
                            <div
                                className="text-uppercase subtitle"
                                style={{ color: '#22C55E' }}
                            >
                                {afterFreeTrial ? '' : 'pricing'}
                            </div>
                            <h1 style={{ color: '#03314B' }}>
                                {afterFreeTrial
                                    ? 'Your Free Trial Has Ended'
                                    : afterSubscriptionEnd
                                    ? 'Your Subscription has ended'
                                    : 'Choose a payment plan'}
                            </h1>
                            <p>
                                {afterFreeTrial
                                    ? 'Select a payment plan to continue.'
                                    : afterSubscriptionEnd
                                    ? 'Your subscription has ended. Renew now to continue receiving Tee Time alerts.'
                                    : 'A game changing service for less than the cost of a beer at your local muni.'}
                            </p>
                        </div>
                        <div className="toggle-wrapper---brix">
                            <p
                                style={{
                                    marginBottom: '0px',
                                    color: '#170f49',
                                }}
                                className="text-blue-800 font-medium "
                            >
                                Monthly
                            </p>
                            <div
                                className={`toggle---brix${
                                    !isAnnually ? ' active' : ''
                                }`}
                                onClick={handleToggleClick}
                            >
                                <div className="toggle-bullet---brix" />
                            </div>
                            <p
                                style={{
                                    marginBottom: '0px',
                                    color: '#170f49',
                                }}
                                className="text-green-600 font-medium "
                            >
                                Annually
                            </p>
                        </div>
                    </div>

                    <div
                        className=" annuallly snipcss-2BV6i style-Igs3O"
                        id="style-Igs3O"
                        style={{
                            width: '90%',
                            maxWidth: '450px',
                            marginInline: 'auto',
                            marginTop: '70px',
                            marginBottom: '70px',
                        }}
                    >
                        <div id="w-node-_55bcf624-2a44-401f-d077-8b1501156616-c305e7ce">
                            <div
                                id="w-node-_9a2f2c87-9cea-ab07-b7c9-d1a1d759a23c-c305e7ce"
                                className="card-pricing popular"
                                style={{ backgroundColor: '#03314B' }}
                            >
                                {isAnnually && (
                                    <div
                                        key={isAnnually}
                                        className="popular-badge-align---brix animate__animated animate__fadeInDown"
                                    >
                                        <div className="badge-popular---brix bg-blue-800">
                                            Popular
                                        </div>
                                    </div>
                                )}
                                <div className="mg-top-18px mg-bottom-32px">
                                    <div
                                        className="text-white animate__animated animate__fadeInDown mb-4"
                                        key={isAnnually}
                                    >
                                        {isAnnually ? (
                                            <div>
                                                <div className="flex items-baseline">
                                                    {/* <span className="text-gray-400 text-lg sm:text-xl lg:text-2xl font-medium line-through mr-2">
                                                        $49.99
                                                    </span> */}
                                                    <span className="text-white text-4xl sm:text-5xl lg:text-5xl font-bold mr-1">
                                                        $59.99
                                                    </span>
                                                    <span className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-300">
                                                        /year
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline">
                                                <span className="text-4xl sm:text-5xl lg:text-5xl font-bold mr-1">
                                                    $7.99
                                                </span>
                                                <span className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-300">
                                                    /month
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-single-200 bold color-white mt-12">
                                        What’s included
                                    </div>
                                    <ul className="list-pricing w-list-unstyled">
                                        <li className="list-item-pricing">
                                            <img
                                                src="https://assets.website-files.com/625734de142f6f14be05e7cb/62582ffca17426dc7899ad90_webflow-clonable-bullet-white.svg"
                                                style={{
                                                    filter: 'hue-rotate(292deg)',
                                                }}
                                                loading="eager"
                                                alt=""
                                                className="icon-bullet---brix"
                                            />
                                            <div className="text-single-200 text-color-neutral-100">
                                                Nearly All Popular Courses
                                            </div>
                                        </li>
                                        <li className="list-item-pricing">
                                            <img
                                                src="https://assets.website-files.com/625734de142f6f14be05e7cb/62582ffca17426dc7899ad90_webflow-clonable-bullet-white.svg"
                                                style={{
                                                    filter: 'hue-rotate(292deg)',
                                                }}
                                                loading="eager"
                                                alt=""
                                                className="icon-bullet---brix"
                                            />
                                            <div className="text-single-200 text-color-neutral-100">
                                                Create Unlimited Alerts
                                            </div>
                                        </li>
                                        <li className="list-item-pricing">
                                            <img
                                                src="https://assets.website-files.com/625734de142f6f14be05e7cb/62582ffca17426dc7899ad90_webflow-clonable-bullet-white.svg"
                                                style={{
                                                    filter: 'hue-rotate(292deg)',
                                                }}
                                                loading="eager"
                                                alt=""
                                                className="icon-bullet---brix"
                                            />
                                            <div className="text-single-200 text-color-neutral-100">
                                                Unlimited Push Notification
                                                Alerts
                                            </div>
                                        </li>
                                        <li className="list-item-pricing">
                                            <img
                                                src="https://assets.website-files.com/625734de142f6f14be05e7cb/62582ffca17426dc7899ad90_webflow-clonable-bullet-white.svg"
                                                style={{
                                                    filter: 'hue-rotate(292deg)',
                                                }}
                                                loading="eager"
                                                alt=""
                                                className="icon-bullet---brix"
                                            />
                                            <div className="text-single-200 text-color-neutral-100">
                                                Great Customer Support
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    className="button-primary light w-button"
                                    style={{
                                        opacity:
                                            isCreatingCheckoutSession ||
                                            userData?.paying
                                                ? '0.5'
                                                : '1',
                                        pointerEvents:
                                            isCreatingCheckoutSession ||
                                            userData?.paying
                                                ? 'none'
                                                : 'auto',
                                        color: '#03314B',
                                    }}
                                    onClick={() => {
                                        if (!userData?.email) {
                                            joinModalOpenRef.current.click()
                                            console.log(
                                                'no user data, opening join modal'
                                            )
                                        } else if (!userData?.paying) {
                                            HandleBuyClick()
                                        } else {
                                            console.log('already paying')
                                        }
                                    }}
                                >
                                    {userData?.email && userData?.paying
                                        ? 'Already Subscribed'
                                        : 'Buy'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PurchasePlan
