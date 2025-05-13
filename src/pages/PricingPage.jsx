import React from 'react'
import useAuth from '../hooks/useAuth'
import Navbar from '../components/landing-page/Navbar'
import PurchasePlan from '../components/PurchasePlan'

const PricingPage = () => {
    const { userData } = useAuth()

    return (
        <>
            {/* {((!loading && !userData) ||
                userData?.subscriptionStatus === 'free_trial' ||
                userData?.subscriptionStatus === 'free_trial_over' ||
                userData?.subscriptionStatus === 'canceled') && (
                <div className=" bg-gray-900 text-white py-8 px-4 sm:px-10">
                    <div
                        className="flex flex-col sm:flex-row items-center justify-between"
                        style={{
                            width: '90%',
                            maxWidth: '700px',
                            margin: 'auto',
                        }}
                    >
                        <div className="sm:mr-8 mb-4 sm:mb-0 max-w-lg text-center sm:text-left">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                                Cyber Week Sale
                            </h2>
                            <p className="text-lg sm:text-xl">
                                Get{' '}
                                <span className="text-green-300 font-bold">
                                    20% OFF
                                </span>{' '}
                                on an annual subscription
                            </p>
                        </div>
                        <button
                            className="text-navy-900 bg-blue-600 hover:bg-green-700 font-bold py-3 px-8 rounded-lg transition ease-in duration-200 text-lg"
                            onClick={() => {
                                navigate('/pricing')
                            }}
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            )} */}
            <Navbar loggedIn={userData} />
            <PurchasePlan />
        </>
    )
}

export default PricingPage
