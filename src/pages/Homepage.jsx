import React, { useEffect, useState, useRef, useCallback } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { RiAlarmWarningFill } from 'react-icons/ri'
import { HiCheckCircle } from 'react-icons/hi'
import { auth } from '../firebase-config'
import CreateTeeTimeAlertForm from '../components/tee-time-alert-form/CreateTeeTimeAlertForm'
import AddNewAlertPreferences from '../utilities/AddNewAlertPreferences'
import EditAccountDetails from '../components/EditAccountDetails'
import CreatedAlerts from '../components/CreatedAlerts'
import useAuth from '../hooks/useAuth'
import PurchasePlan from '../components/PurchasePlan'
import UpdateGolferRecord from '../utilities/UpdateGolferRecord'

import { Header } from '../components/Header'
import { NotificationDisplay, useNotification } from '../hooks/useNotification'

const Homepage = () => {
    const navigate = useNavigate()

    const [showThankYou, setShowThankYou] = useState(false)

    const alertCreatedAfterSignupModalRef = useRef(null)

    const {
        ShowNotification,
        showNotification,
        notificationType,
        notificationText,
        setShowNotification,
    } = useNotification()

    const { userData, loading, token } = useAuth()
    const [golferData, setGolferData] = useState(null)

    useEffect(() => {
        if (!loading && !userData) {
            navigate('/login')
        }
        if (userData) {
            setGolferData(userData)
        }
    }, [loading, userData, navigate])

    const HandleThankYouMessage = useCallback(async () => {
        const url = new URL(document.URL)
        // const thankYouShown = localStorage.getItem('thankYouShown');

        if (
            url.searchParams.get('thank-you') !== null /* && !thankYouShown */
        ) {
            setShowThankYou(true)
            // Remove thank-you from the URL
            url.searchParams.delete('thank-you')
            window.history.replaceState(
                {},
                document.title,
                url.pathname + (url.search ? `?${url.search.slice(1)}` : '')
            )
            // Save the flag to local storage
            // localStorage.setItem('thankYouShown', 'true');
        } // else if search param is unsubscribe-email
        else if (url.searchParams.get('unsubscribe-email') !== null) {
            await UpdateGolferRecord(
                golferData?.id,
                ['golfer_allow_marketing_emails'],
                [false],
                token
            )
            // show notification
            ShowNotification(
                'You have been unsubscribed from all marketing emails',
                'success'
            )
        } else if (url.searchParams.get('unsubscribe-text') !== null) {
            await UpdateGolferRecord(
                golferData?.id,
                ['golfer_allow_marketing_sms'],
                ['false'],
                token
            )
            // show notification
            ShowNotification(
                'You have been unsubscribed from all marketing texts',
                'success'
            )
        }

        window.history.replaceState(
            {},
            document.title,
            url.pathname + (url.search ? `?${url.search.slice(1)}` : '')
        )
    }, [ShowNotification, golferData?.id, token])

    useEffect(() => {
        if (!golferData?.id) return
        HandleThankYouMessage()
    }, [HandleThankYouMessage, golferData?.id])

    const [golferUUID, setGolferUUID] = useState(null)
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setGolferUUID(currentUser.uid)
            }
        })
    }, [])

    const handleCreateAlert = useCallback(
        async (submittedPreferences, setAddNewAlertError) => {
            await AddNewAlertPreferences(
                golferData,
                setGolferData,
                submittedPreferences,
                golferUUID,
                setAddNewAlertError,
                ShowNotification,
                token
            )

            if (golferData?.totalAlertsCreated === 0) {
                alertCreatedAfterSignupModalRef?.current?.click()
            }
        },
        [
            ShowNotification,
            alertCreatedAfterSignupModalRef,
            golferData,
            golferUUID,
            setGolferData,
            token,
        ]
    )

    const HandleCreatingAlertAfterSingingUp = useCallback(async () => {
        if (!golferData?.id) return
        // if preferences exist in session storage, add an alert with those preferences then clear session storage
        if (sessionStorage.getItem('preferences')) {
            const preferences = JSON.parse(
                sessionStorage.getItem('preferences')
            )
            sessionStorage.removeItem('preferences')
            await AddNewAlertPreferences(
                golferData,
                setGolferData,
                preferences,
                golferUUID,
                () => {},
                ShowNotification,
                token
            )
            alertCreatedAfterSignupModalRef.current.click()
        }
    }, [ShowNotification, golferData, golferUUID, token])

    useEffect(() => {
        HandleCreatingAlertAfterSingingUp()
    }, [HandleCreatingAlertAfterSingingUp])

    const inputRef = useRef(null)

    if (loading) {
        return null
    }

    return (
        <div style={{ backgroundColor: '#fafafa' }}>
            {/* {(golferData?.subscriptionStatus === 'free_trial' ||
                golferData?.subscriptionStatus === 'free_trial_over' ||
                golferData?.subscriptionStatus === 'canceled') && (
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

            <Header
                golferUUID={golferUUID}
                golferData={golferData}
                navigate={navigate}
                showThankYou={showThankYou}
                inputRef={inputRef}
                token={token}
            />

            <NotificationDisplay
                showNotification={showNotification}
                notificationText={notificationText}
                notificationType={notificationType}
                setShowNotification={setShowNotification}
            />

            {golferData?.email && (
                <EditAccountDetails
                    golferData={golferData}
                    setGolferData={setGolferData}
                    ShowNotification={ShowNotification}
                    inputRef={inputRef}
                />
            )}

            {showThankYou && (
                <div style={{ marginBlock: '20px' }}>
                    <HiCheckCircle
                        className="text-[#50C878] "
                        style={{ fontSize: '80px', margin: 'auto' }}
                    />

                    <h1
                        style={{
                            fontSize: '50px',
                            margin: 'auto',
                            width: 'fit-content',
                            marginTop: '25px',
                        }}
                        className="font-bold"
                    >
                        Welcome To The Club!
                    </h1>
                    <p
                        style={{
                            width: 'fit-content',
                            margin: 'auto',
                            fontSize: '18px',
                            marginTop: '12px',
                        }}
                        className="text-slate-800"
                    >
                        Your game will thank you for it.
                    </p>
                </div>
            )}

            {golferData?.email && !golferData?.phone && (
                <div
                    style={{
                        width: '90%',
                        maxWidth: '540px',
                        zIndex: '1',
                        margin: 'auto',
                        marginBottom: '24px',
                        marginTop: '24px',
                    }}
                    id="alert-border-2"
                    className="flex items-center p-3  text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800 dark:border-red-800 "
                    role="alert"
                >
                    <RiAlarmWarningFill />

                    <div className="ms-3 ml-4 text-sm font-medium">
                        Please update your phone number in your{' '}
                        <b>Account Settings</b>
                    </div>
                </div>
            )}
            {!golferData?.email && !loading && (
                <div
                    style={{
                        width: '90%',
                        maxWidth: '540px',
                        zIndex: '1',
                        margin: 'auto',
                        marginBottom: '24px',
                        marginTop: '24px',
                    }}
                    id="alert-border-2"
                    className="flex items-center p-3  text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800 "
                    role="alert"
                >
                    <RiAlarmWarningFill />

                    <div className="ms-3 ml-4 text-sm font-medium">
                        Something is wrong with your User Data! Please contact
                        support
                    </div>
                </div>
            )}

            {golferData?.email &&
                (golferData?.paying ||
                    golferData?.subscriptionStatus === 'free_trial') && (
                    <div>
                        <CreateTeeTimeAlertForm
                            handleOnSubmission={handleCreateAlert}
                            ShowNotification={ShowNotification}
                        />
                        <CreatedAlerts
                            golferData={golferData}
                            setGolferData={setGolferData}
                            golferUUID={golferUUID}
                            ShowNotification={ShowNotification}
                            token={token}
                        />
                    </div>
                )}

            {golferData?.email && !(golferData?.paying || golferData?.subscriptionStatus === 'free_trial') && (
                <PurchasePlan 
                    afterFreeTrial={golferData?.subscriptionStatus === 'free_trial'} 
                    afterSubscriptionEnd={golferData?.subscriptionStatus === 'payment_failed'}
                />
            )}

        </div>
    )
}

export default Homepage
