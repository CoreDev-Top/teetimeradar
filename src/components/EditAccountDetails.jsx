import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import {
    updateEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    getAuth,
} from 'firebase/auth'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { FaExclamationCircle } from 'react-icons/fa'
import useAuth from '../hooks/useAuth'

import UpdateGolferRecord from '../utilities/UpdateGolferRecord'
import UpdatePayment from './UpdatePaymentForm'

const EditAccountDetails = ({
    golferData,
    setGolferData,
    ShowNotification,
    inputRef,
}) => {
    const navigate = useNavigate()
    const auth = getAuth()
    const { token } = useAuth()
    const [settingsTab, setSettingsTab] = useState('profile')

    const [newGolferData, setNewGolferData] = useState({
        firstName: golferData.firstName,
        lastName: golferData.lastName,
        email: golferData.email,
        phoneNumber: golferData.phone,
        allowSMS: golferData.allowSms,
        allowEmail: golferData.allowEmail,
        allowWebPush: golferData.allowWebPush,
        subscriptionStatus: golferData?.subscriptionStatus,
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewGolferData({
            ...newGolferData,
            [name]: value,
        })
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        setNewGolferData({
            ...newGolferData,
            [name]: checked,
        })
    }

    const [allowSavingChanges, setAllowSavingChanges] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    useEffect(() => {
        if (!golferData) return
        if (
            golferData.firstName === newGolferData.firstName &&
            golferData.golfer_last_name === newGolferData.lastName &&
            golferData.email === newGolferData.email &&
            golferData.phone === newGolferData.phoneNumber &&
            golferData.allowEmail === newGolferData.allowEmail &&
            golferData.allowSms === newGolferData.allowSMS &&
            golferData.allowWebPush === newGolferData.allowWebPush &&
            golferData.subscriptionStatus === newGolferData.subscriptionStatus
        )
            setAllowSavingChanges(false)
        else setAllowSavingChanges(true)
    }, [newGolferData, golferData])

    // Update Firebase auth email
    const UpdateFirebaseAuthEmail = async () => {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            newGolferData.password
        )

        try {
            await reauthenticateWithCredential(auth.currentUser, credential)
            await updateEmail(auth.currentUser, newGolferData.email)
            return true
        } catch (error) {
            // define a generic error response
            const errorResponse = {
                error: true,
                message: 'Unknown error occurred.',
            }

            switch (error.code) {
                case 'auth/wrong-password':
                    errorResponse.message = 'The password is invalid.'
                    break
                case 'auth/invalid-email':
                    errorResponse.message =
                        'The email address is badly formatted.'
                    break
                case 'auth/user-not-found':
                    errorResponse.message =
                        'No user corresponding to the provided email.'
                    break
                case 'auth/email-already-in-use':
                    errorResponse.message =
                        'The email address is already in use by another account.'
                    break
                default:
                    errorResponse.message = error.message
            }

            return errorResponse
        }
    }

    const PauseSubscription = async () => {
        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/stripe/pause-subscription`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: golferData?.id }),
                    // body: JSON.stringify({ id: [1], column: ["download_thumbnail_duration"], new_value: [(totalDuration) / 1000] })
                }
            )
            // check if response was scuccessful
            if (response.status !== 200) {
                console.log(
                    `error when trying to pause golfer subscription ${response.status}`
                )
                return
            }

            console.log(
                '%c golfer subscription pause successfully ',
                'color: green'
            )
        } catch (e) {
            console.log(
                `error when trying to pause golfer subscription ${e.message}`
            )
        }
    }

    const ReactivateSubscription = async () => {
        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/stripe/reactivate-subscription`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: golferData?.id }),
                }
            )

            // Check if the response was successful
            if (response.status !== 200) {
                console.log(
                    `Error when trying to reactivate golfer subscription ${response.status}`
                )
                return
            }

            console.log(
                '%c golfer subscription reactivated successfully ',
                'color: green'
            )
        } catch (e) {
            console.log(
                `Error when trying to reactivate golfer subscription ${e.message}`
            )
        }
    }

    const CancelSubscription = async () => {
        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/stripe/cancel-subscription`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: golferData?.id }),
                    // body: JSON.stringify({ id: [1], column: ["download_thumbnail_duration"], new_value: [(totalDuration) / 1000] })
                }
            )
            // check if response was scuccessful
            if (response.status !== 200) {
                console.log(
                    `error when trying to canceled golfer subscription ${response.status}`
                )
                return
            }

            console.log(
                '%c golfer subscription canceled successfully ',
                'color: green'
            )
        } catch (e) {
            console.log(
                `error when trying to CANCEL golfer subscription ${e.message}`
            )
        }
    }

    const [savingChangesLoading, setSavingChangesLoading] = useState(false)
    const UpdateEditDetailsChanges = async () => {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            allowEmail,
            allowSMS,
            allowWebPush,
            subscriptionStatus,
        } = newGolferData
        setSavingChangesLoading(true)

        if (email !== golferData.email) {
            const result = await UpdateFirebaseAuthEmail()

            if (result.error) {
                console.log(
                    'Something went wrong when updating email on Firebase'
                )
                ShowNotification(result.message, 'error')
                setSavingChangesLoading(false)
                return
            }
        }
        if (
            golferData?.subscriptionStatus === 'active' &&
            newGolferData?.subscriptionStatus === 'paused'
        ) {
            await PauseSubscription()
        }

        if (
            golferData?.subscriptionStatus === 'paused' &&
            newGolferData?.subscriptionStatus === 'active'
        ) {
            await ReactivateSubscription()
        }

        if (
            golferData?.subscriptionStatus === 'active' &&
            newGolferData?.subscriptionStatus === 'canceled'
        ) {
            await CancelSubscription()
        }

        try {
            await UpdateGolferRecord(
                golferData?.id,
                [
                    'golfer_first_name',
                    'golfer_last_name',
                    'golfer_email',
                    'golfer_phone',
                    'golfer_allow_email',
                    'golfer_allow_sms',
                    'golfer_allow_web_push',
                ],
                [
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    allowEmail,
                    allowSMS,
                    allowWebPush,
                ],
                token
            )

            const updatedGolferData = {
                ...golferData,
                firstName,
                golfer_last_name: lastName,
                email,
                phone: phoneNumber,
                allowEmail,
                allowSms: allowSMS,
                allowWebPush,
                subscriptionStatus,
            }

            setGolferData(updatedGolferData)
            /*
           setNewGolferData({
                ...newGolferData,
                subscriptionStatus: 'canceled',
            })
            */

            console.log('Details updated successfully')
            ShowNotification('Details updated!', 'success')
        } catch (e) {
            console.log(e.message)
            ShowNotification(
                'Something went wrong when updating your details!',
                'error'
            )
        }

        setSavingChangesLoading(false)
    }

    const CancelSubscriptionOnly = async () => {
        setSavingChangesLoading(true)

        // Check if the current subscription status is 'active'
        if (golferData?.subscriptionStatus === 'active') {
            try {
                await CancelSubscription() // Call to cancel the subscription

                // Update the golfer's subscription status locally
                const updatedGolferData = {
                    ...golferData,
                    subscriptionStatus: 'canceled',
                }

                setGolferData(updatedGolferData)
                console.log('Subscription canceled successfully')
                setNewGolferData({
                    ...newGolferData,
                    subscriptionStatus: 'canceled',
                })
                ShowNotification('Subscription canceled!', 'success')
                inputRef?.current?.click()
            } catch (e) {
                console.log(e.message)
                ShowNotification(
                    `Failed to cancel subscription! £{e.message}`,
                    'error'
                )
            }
        } else {
            console.log('No active subscription to cancel')
            ShowNotification('No active subscription to cancel', 'info')
        }

        setSavingChangesLoading(false)
    }

    return (
        <div>
            <button
                type="button"
                ref={inputRef}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
                style={{
                    fontWeight: '700',
                    color: 'rgb(41, 47, 77)' /* , position: 'absolute', right:'14px' */,
                }}
                className="inline-block rounded px-4 pt-3 pb-2 text-sm text-gray-500 font-bold uppercase leading-normal  focus:ring-0 "
            >
                <div className="flex items-center hidden">
                    {' '}
                    <div>Edit Account Settings</div>{' '}
                    <AiFillEdit style={{ marginLeft: '5px' }} />
                </div>
            </button>

            <div
                className="modal fade fixed visible top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="exampleModal3"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel3"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <button
                                type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <ul className="flex flex-wrap xl:flex-nowrap  justify-around -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                <li className="mr-2 w-fit xl:w-full">
                                    <a
                                        href="#"
                                        onClick={() => {
                                            setSettingsTab('profile')
                                            setShowPayment(false)
                                        }}
                                        className={clsx(
                                            'flex justify-center w-full',
                                            settingsTab === 'profile'
                                                ? 'inline-flex p-4 text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 group'
                                                : 'inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                                        )}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className={clsx(
                                                settingsTab === 'profile'
                                                    ? 'w-5 h-5 mr-2 text-green-600 dark:text-green-500'
                                                    : 'w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                                            )}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Profile
                                    </a>
                                </li>
                                <li className="mr-2 w-fit xl:w-full">
                                    <a
                                        href="#"
                                        onClick={() => {
                                            setSettingsTab('preferences')
                                            setShowPayment(false)
                                        }}
                                        className={clsx(
                                            'flex justify-center w-full',
                                            settingsTab === 'preferences'
                                                ? 'inline-flex p-4 text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 group'
                                                : 'inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                                        )}
                                        aria-current="page"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className={clsx(
                                                settingsTab === 'preferences'
                                                    ? 'w-5 h-5 mr-2 text-green-600 dark:text-green-500'
                                                    : 'w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                                            )}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Preferences
                                    </a>
                                </li>

                                <li className="mr-2 w-fit xl:w-full">
                                    <a
                                        href="#"
                                        onClick={() =>
                                            setSettingsTab('billing')
                                        }
                                        className={clsx(
                                            'flex justify-center w-full',
                                            settingsTab === 'billing'
                                                ? 'inline-flex p-4 text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500 group'
                                                : 'inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'
                                        )}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className={clsx(
                                                settingsTab === 'billing'
                                                    ? 'w-5 h-5 mr-2 text-green-600 dark:text-green-500'
                                                    : 'w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                                            )}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Billing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div
                            className="modal-body relative p-6 text-gray-500 transition ease-in-out delay-150"
                            style={{ paddingBlock: '30px' }}
                        >
                            <h5
                                className="text-2xl font-medium leading-normal pb-8"
                                id="exampleModalLabel"
                            >
                                {settingsTab === 'profile' && 'Profile details'}
                                {settingsTab === 'preferences' &&
                                    'Alerts preferences'}

                                {settingsTab === 'billing' &&
                                    'Billing information'}

                                {settingsTab === 'billing' &&
                                    golferData?.subscriptionStatus ===
                                        'active' && (
                                        <div className="text-gray-400 text-xs">
                                            Your next billing cycle will be on{' '}
                                            {new Date(
                                                golferData?.subscriptionEndDate
                                            )?.toLocaleDateString()}
                                        </div>
                                    )}
                                {settingsTab === 'billing' &&
                                    (golferData?.subscriptionStatus ===
                                        'free_trial' ||
                                        golferData?.subscriptionStatus ===
                                            'free_trial_over') &&
                                    golferData?.freeTrialStartDate && (
                                        <div className="flex items-center justify-between">
                                            <div className="text-gray-400 text-xs">
                                                {`Your free trial will end on ${new Date(
                                                    new Date(
                                                        golferData?.freeTrialStartDate
                                                    ).setDate(
                                                        new Date(
                                                            golferData?.freeTrialStartDate
                                                        ).getDate() + 15
                                                    )
                                                ).toLocaleDateString()}`}
                                            </div>
                                        </div>
                                    )}
                            </h5>

                            {settingsTab === 'profile' && (
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group mb-8">
                                            <label className="text-sm test-gray-200 p-2 pr-0">
                                                {' '}
                                                First name{' '}
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={newGolferData.firstName}
                                                onChange={handleInputChange}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                placeholder="First name"
                                            />{' '}
                                        </div>
                                        <div className="form-group mb-8">
                                            <label className="text-sm test-gray-200 p-2 pr-0">
                                                {' '}
                                                Last name{' '}
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={newGolferData.lastName}
                                                onChange={handleInputChange}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                placeholder="Last name"
                                            />{' '}
                                        </div>
                                    </div>
                                    <div className="form-group mb-10">
                                        <label className="text-sm test-gray-200 p-2 pr-0">
                                            {' '}
                                            Email*{' '}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={newGolferData.email}
                                            onChange={handleInputChange}
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleInput125"
                                            placeholder="Email address"
                                        />
                                        <div
                                            className="absolute w-full text-xs text-neutral-500 dark:text-neutral-200"
                                            data-te-input-helper-ref
                                        >
                                            *email will also be changed for
                                            Login
                                        </div>
                                    </div>
                                    {newGolferData.email !==
                                        golferData?.email && (
                                        <div className="form-group mb-8">
                                            <label className="text-sm test-gray-200 p-2 pr-0">
                                                {' '}
                                                Password verification{' '}
                                            </label>

                                            <input
                                                name="password"
                                                type="password"
                                                value={newGolferData.password}
                                                onChange={handleInputChange}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="exampleInput125"
                                                placeholder="Password"
                                            />
                                        </div>
                                    )}
                                    <div className="form-group mb-8 ">
                                        <label className="text-sm test-gray-200 p-2 pr-0">
                                            {' '}
                                            Phone number{' '}
                                        </label>

                                        <div className=" flex items-center">
                                            <div className="mr-2 text-gray-500">
                                                +1
                                            </div>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={
                                                    newGolferData.phoneNumber
                                                }
                                                onChange={(e) => {
                                                    const formattedValue =
                                                        e.target.value.replace(
                                                            /\s/g,
                                                            ''
                                                        )
                                                    handleInputChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: formattedValue,
                                                        },
                                                    })
                                                }}
                                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                id="exampleInput125"
                                                placeholder="Phone Number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {settingsTab === 'preferences' && (
                                <div>
                                    <div className="form-check form-switch pb-10">
                                        <input
                                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                            style={{ transform: 'scale(1.5)' }}
                                            name="allowEmail"
                                            checked={newGolferData.allowEmail}
                                            onChange={handleCheckboxChange}
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                        />

                                        <label
                                            className="form-check-label inline-block pl-10 text-gray-800"
                                            htmlFor="flexSwitchCheckDefault"
                                        >
                                            Send via <b>email</b>
                                        </label>
                                    </div>
                                    <div className="form-check form-switch pb-10">
                                        <input
                                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                            style={{ transform: 'scale(1.5)' }}
                                            name="allowSMS"
                                            checked={newGolferData.allowSMS}
                                            onChange={handleCheckboxChange}
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                        />

                                        <label
                                            className="form-check-label inline-block pl-10 text-gray-800"
                                            htmlFor="flexSwitchCheckDefault"
                                        >
                                            Send via <b>SMS</b>
                                        </label>
                                    </div>
                                    <div className="form-check form-switch pb-10">
                                        <input
                                            className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                            style={{ transform: 'scale(1.5)' }}
                                            name="allowWebPush"
                                            checked={newGolferData.allowWebPush}
                                            onChange={handleCheckboxChange}
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                        />

                                        <label
                                            className="form-check-label inline-block pl-10 text-gray-800"
                                            htmlFor="flexSwitchCheckDefault"
                                        >
                                            Send via <b>Web Push</b>
                                        </label>
                                    </div>
                                </div>
                            )}
                            {settingsTab === 'billing' && (
                                <div className="pt-4">
                                    {golferData?.subscriptionStatus ===
                                        'payment_failed' &&
                                        !golferData?.paying && (
                                            <div
                                                className="bg-yellow-100 p-4 rounded mb-4"
                                                style={{
                                                    width: '90%',
                                                    maxWidth: '540px',
                                                }}
                                            >
                                                <p className="text-base text-gray-700 font-normal mb-2 flex items-center">
                                                    <FaExclamationCircle
                                                        className="text-yellow-500 mr-3"
                                                        size={16}
                                                    />
                                                    Subscription Ended
                                                </p>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    We were unable to process
                                                    your payment after multiple
                                                    attempts. As a result, your
                                                    subscription has ended.
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    To continue enjoying TeeTime
                                                    alerts, please purchase a
                                                    new subscription.
                                                </p>
                                            </div>
                                        )}

                                    {golferData?.subscriptionStatus ===
                                        'payment_failed' &&
                                        golferData?.paying && (
                                            <div
                                                className="bg-yellow-100 p-4 rounded mb-4"
                                                style={{
                                                    width: '90%',
                                                    maxWidth: '540px',
                                                }}
                                            >
                                                <p className="text-base text-gray-700 font-normal mb-2 flex items-center">
                                                    <FaExclamationCircle
                                                        className="text-yellow-500 mr-3"
                                                        size={16}
                                                    />
                                                    Payment Issue
                                                </p>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    There is an issue with your
                                                    payment. Please update your
                                                    payment method to continue
                                                    your subscription.
                                                </p>
                                                <button
                                                    type="button"
                                                    id="update-payment-method"
                                                    style={{
                                                        width: '90%',
                                                        maxWidth: '200px',
                                                    }}
                                                    className="px-6 py-2.5 bg-yellow-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-700 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-800 active:shadow-lg transition duration-150 ease-in-out"
                                                    onClick={() =>
                                                        setShowPayment(
                                                            !showPayment
                                                        )
                                                    }
                                                >
                                                    Update Payment Method
                                                </button>
                                            </div>
                                        )}

                                    {golferData?.subscriptionStatus ===
                                        'canceled' &&
                                        golferData?.paying && (
                                            <div>
                                                Your subscription has been
                                                canceled. Your account would
                                                remain active until the end of
                                                your current billing cycle{' '}
                                                {new Date(
                                                    golferData?.subscriptionEndDate
                                                )?.toLocaleDateString()}
                                                .{' '}
                                                <a
                                                    data-bs-toggle="modal"
                                                    className="text-blue-400 underline cursor-pointer"
                                                    onClick={() =>
                                                        navigate('/pricing')
                                                    }
                                                >
                                                    You can reactivate your
                                                    subscription at any time.
                                                </a>
                                            </div>
                                        )}
                                    {(golferData?.subscriptionStatus ===
                                        'active' ||
                                        golferData?.subscriptionStatus ===
                                            'paused' ||
                                        golferData?.subscriptionStatus ===
                                            'in_grace_period') && (
                                        <div className="pb-10">
                                            <button
                                                type="button"
                                                id="update-payment-method"
                                                style={{
                                                    width: '90%',
                                                    maxWidth: '200px',
                                                    pointerEvents:
                                                        golferData?.subscriptionStatus ===
                                                            'active' ||
                                                        golferData?.paying ||
                                                        golferData?.subscriptionStatus ===
                                                            'paused' ||
                                                        golferData?.subscriptionStatus ===
                                                            'in_grace_period'
                                                            ? 'auto'
                                                            : 'none',
                                                }}
                                                className={`-ml-2 ${
                                                    golferData?.subscriptionStatus ===
                                                        'active' ||
                                                    golferData?.paying ||
                                                    golferData?.subscriptionStatus ===
                                                        'paused' ||
                                                    golferData?.subscriptionStatus ===
                                                        'in_grace_period'
                                                        ? 'px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out'
                                                        : 'px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80'
                                                }`}
                                                onClick={() =>
                                                    setShowPayment(!showPayment)
                                                }
                                            >
                                                Update Payment Method
                                            </button>
                                        </div>
                                    )}
                                    {(golferData?.subscriptionStatus ===
                                        'active' ||
                                        golferData?.subscriptionStatus ===
                                            'paused') && (
                                        <div
                                            className="form-check form-switch pb-10"
                                            style={{
                                                opacity: golferData?.paying
                                                    ? '1'
                                                    : '0.5',
                                                pointerEvents:
                                                    golferData?.paying
                                                        ? 'auto'
                                                        : 'none',
                                            }}
                                        >
                                            <input
                                                className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                                                style={{
                                                    transform: 'scale(1.5)',
                                                }}
                                                checked={
                                                    newGolferData.subscriptionStatus ===
                                                    'paused'
                                                }
                                                onChange={(e) => {
                                                    setNewGolferData({
                                                        ...newGolferData,
                                                        subscriptionStatus: e
                                                            .target.checked
                                                            ? 'paused'
                                                            : 'active',
                                                    })
                                                }}
                                                type="checkbox"
                                                role="switch"
                                                id="flexSwitchCheckDefault"
                                            />
                                            <label
                                                className="form-check-label inline-block pl-10 text-gray-800"
                                                htmlFor="flexSwitchCheckDefault"
                                            >
                                                Pause subscription{' '}
                                            </label>
                                        </div>
                                    )}
                                    {golferData?.subscriptionStatus ===
                                        'active' && (
                                        <>
                                            {golferData?.subscriptionStatus ===
                                                'in_grace_period' && (
                                                <div
                                                    className="bg-gray-100 p-4 rounded mb-4"
                                                    style={{
                                                        width: '90%',
                                                        maxWidth: '540px',
                                                    }}
                                                >
                                                    <p className="text-base text-gray-700 font-normal mb-2 flex items-center">
                                                        <FaExclamationCircle
                                                            className="text-yellow-500 mr-3"
                                                            size={16}
                                                        />
                                                        We failed to charge your
                                                        card!
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Next charge attempt:{' '}
                                                        {new Date(
                                                            golferData?.nextPaymentAttemptAfterFailure *
                                                                1000
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            }
                                                        )}
                                                        .
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        To avoid service
                                                        interruption, please
                                                        update your payment
                                                        method using the button
                                                        below.
                                                    </p>
                                                </div>
                                            )}
                                            <div>
                                                <button
                                                    data-bs-toggle="modal"
                                                    style={{
                                                        width: '90%',
                                                        maxWidth: '200px',
                                                        pointerEvents:
                                                            (golferData?.subscriptionStatus !==
                                                                'active' ||
                                                                !golferData?.paying) &&
                                                            'none',
                                                    }}
                                                    data-bs-target="#cancel-modal"
                                                    type="button"
                                                    id="update-payment-method"
                                                    className={`-ml-2 ${
                                                        golferData?.subscriptionStatus !==
                                                            'active' ||
                                                        !golferData?.paying
                                                            ? 'px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80'
                                                            : 'px-6 py-2.5 bg-red-700 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-900 hover:shadow-lg focus:bg-red-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg transition duration-150 ease-in-out'
                                                    }`}
                                                >
                                                    Cancel subscription
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {showPayment && (
                            <UpdatePayment
                                golferId={golferData?.id}
                                ShowNotification={ShowNotification}
                            />
                        )}

                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                // data-bs-dismiss="modal"
                                className={clsx(
                                    'px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out ml-1',
                                    savingChangesLoading && ' pulse2 ',
                                    !allowSavingChanges && 'opacity-50 '
                                )}
                                style={{
                                    pointerEvents:
                                        allowSavingChanges &&
                                        !savingChangesLoading
                                            ? 'all'
                                            : 'none',
                                }}
                                onClick={async () => {
                                    if (allowSavingChanges) {
                                        UpdateEditDetailsChanges()
                                    }
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="cancel-modal"
                tabIndex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-labelledby="cancel-modal-label"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            {/* <h5 class="text-xl font-medium leading-normal text-gray-800" id="cancel-modal-label">Cancel Paid Subscription</h5> */}
                            <button
                                type="button"
                                onClick={() => inputRef?.current?.click()}
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body relative p-10 bg-gray-50 text-gray-800  rounded-lg">
                            <h1 className="text-4xl font-medium mb-8">
                                We&apos;re sorry to see you go!
                            </h1>

                            <p className="text-lg font-normal mb-10">
                                We hope you&apos;ve enjoyed using Tee Time
                                Alerts! Instead of cancelling, consider pausing
                                your subscription payments, and we&apos;ll keep
                                your account open for when you&apos;re ready to
                                return.
                            </p>

                            <div className="text-gray-600 font-light text-sm">
                                Note: Upon cancellation, your subscription will
                                remain active until the end of the current
                                billing cycle. You will not be charged
                                thereafter.
                            </div>
                        </div>

                        <div
                            className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"
                            style={{
                                opacity: savingChangesLoading ? '0.5' : '1',
                                pointerEvents: savingChangesLoading && 'none',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    CancelSubscriptionOnly()
                                }}
                                className="px-6 py-2.5 border border-green-600 bg-white text-green-600 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-100 hover:shadow-lg focus:bg-green-100 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-200 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Cancel Subscription
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setNewGolferData({
                                        ...newGolferData,
                                        subscriptionStatus: 'paused',
                                    })
                                    inputRef?.current?.click()
                                }}
                            >
                                Pause Subscription
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditAccountDetails
