/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { RiListSettingsFill } from 'react-icons/ri'
import { MdInstallMobile } from 'react-icons/md'
import { FiLogOut, FiMessageSquare, FiHome } from 'react-icons/fi'
import { AiFillEdit } from 'react-icons/ai'
import ConfettiExplosion from 'react-confetti-explosion'
import { signOut } from 'firebase/auth'
import { Icon } from '@iconify/react'
import { UAParser } from 'ua-parser-js'
// eslint-disable-next-line import/no-unresolved
import { toast } from 'sonner'

import { getDeviceInfo } from '../utilities/pwa'
import {
    shouldShowNotificationPrompt,
    requestNotificationsPermission,
} from '../notifications'

import { auth } from '../firebase-config'
import Logo from '../assets/images/logo.png'
import { hasPushFeatureEnabled } from '../utilities/hasPushFeatureEnabled'

export const Header = ({
    golferData,
    navigate,
    showThankYou,
    inputRef,
    golferUUID,
    token,
}) => {
    const [freeTrialDaysLeft, setFreeTrialDaysLeft] = useState(0)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        // get how many days left in trial using freeTrialStartDate, free trial is 15 days
        if (golferData?.freeTrialStartDate) {
            const trialStartDate = new Date(golferData.freeTrialStartDate)
            const today = new Date()
            // days passed since trial started
            const daysPassed = (
                (today - trialStartDate) /
                (1000 * 60 * 60 * 24)
            ).toFixed(0)
            const daysLeft = 14 - daysPassed

            // if days left is negative, set to 0
            if (daysLeft < 0) {
                setFreeTrialDaysLeft(0)
                return
            }

            setFreeTrialDaysLeft(daysLeft)
        }
    }, [golferData?.freeTrialStartDate])

    const { device, pwa } = getDeviceInfo(new UAParser())

    useEffect(() => {
        window.golferData = golferData
    }, [golferData])

    useEffect(() => {
        window.device = device
    }, [device])

    function displayPWACTA() {
        if (
            hasPushFeatureEnabled({
                golferUUID,
            })
        ) {
            if (golferData && shouldShowNotificationPrompt(golferData)) {
                if (pwa.isStandalone(window)) {
                    toast.custom(
                        (t) => (
                            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-2xl">
                                <h4 className="text-[18px] font-bold">
                                    Give Permissions for Push Notifications
                                </h4>
                                <p className="text-[16px]">
                                    This will allow you to receive unlimited
                                    push notifications when tee times become
                                    available.
                                </p>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
                                    onClick={() => {
                                        requestNotificationsPermission(
                                            token,
                                            golferData?.hasNotificationSubscription,
                                            () => {
                                                window.location.reload()
                                            }
                                        )
                                        toast.dismiss(t)
                                    }}
                                >
                                    Allow
                                </button>
                            </div>
                        ),
                        {
                            id: 'give-permission',
                            duration: 60 * 60 * 1000,
                        }
                    )
                } else {
                    toast.custom(
                        (t) => (
                            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-2xl">
                                <h4 className="text-[18px] font-bold">
                                    Install the Tee Time Alerts Mobile App
                                </h4>
                                <p className="text-[16px]">
                                    Receive UNLIMITED alerts via push
                                    notifications + have quicker access to our
                                    tool
                                </p>
                                <div className="flex justify-start">
                                    {/* Prompt for desktop */}
                                    {!device.isMobile ? (
                                        <div className="mt-2 text-[16px]">
                                            Go to your phone, open up{' '}
                                            <a
                                                href="https://teetimeradar.io"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline"
                                            >
                                                teetimeradar.io
                                            </a>
                                            , and follow the prompts
                                        </div>
                                    ) : (
                                        <>
                                            {/* Prompt for ios Devices */}
                                            {device.isIOS &&
                                            !device.isAndroid ? (
                                                <div className="flex flex-col gap-2 mt-2 text-[16px]">
                                                    <div className="font-bold">
                                                        1. Click the{' '}
                                                        <Icon
                                                            icon="material-symbols:ios-share"
                                                            className="inline-block mb-[6px]"
                                                        />{' '}
                                                        within your mobile
                                                        browser window
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        2. Click "Add to Home
                                                        Screen"{' '}
                                                        <Icon icon="icon-park-outline:add" />
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        3. Open the newly
                                                        installed app
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        4. Login to your account
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        5. Allow notifications
                                                        when prompted
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2 mt-2 text-[16px]">
                                                    <div className="font-bold">
                                                        1. Click the{' '}
                                                        <Icon
                                                            icon="zondicons:dots-horizontal-triple"
                                                            className="inline-block mb-[6px]"
                                                        />{' '}
                                                        within your mobile
                                                        browser window
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        2. Click "Add to Home
                                                        Screen"{' '}
                                                        <Icon icon="ic:baseline-add-to-home-screen" />
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        3. Open the newly
                                                        installed app
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        4. Login to your account
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 font-bold">
                                                        5. Allow notifications
                                                        when prompted
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
                                    onClick={() => {
                                        toast.dismiss(t)
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        ),
                        {
                            id: 'install-pwa',
                            duration: 60 * 60 * 1000,
                        }
                    )
                }
            }
        }
    }

    useEffect(() => {
        window.golferUUID = golferUUID

        // Disabled PWA popup
        // displayPWACTA()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        golferUUID,
        device?.isIOS,
        device?.isAndroid,
        golferData?.hasNotificationSubscription,
        device?.isMobile,
        pwa,
        token,
        golferData,
    ])

    useEffect(() => {
        window.toast = toast
    }, [])

    const logout = async () => {
        await signOut(auth)

        localStorage.removeItem('isUserLoggedIn')
        navigate('/')
    }

    return (
        <>
            {(golferData?.subscriptionStatus === 'free_trial' ||
                golferData?.subscriptionStatus === 'free_trial_over') && (
                <div
                    className="bg-indigo-900 text-center py-4 lg:px-4 text-xs xl:text-sm"
                    style={{ background: 'rgb(30 37 41)' }}
                >
                    <div
                        className="p-2 bg-indigo-8s00 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
                        role="alert"
                    >
                        <span
                            className="flex mx-2 rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3"
                            style={{ background: 'rgba(7, 93, 141, 1)' }}
                        >
                            Free Trial
                        </span>
                        <span className=" mr-2 text-left flex-auto">
                            {freeTrialDaysLeft === 0
                                ? `Your free trial has ended`
                                : `You have ${freeTrialDaysLeft} days left in your Free Trial`}
                            ,{' '}
                            <a
                                className="cursor-pointer underline text-blue-400"
                                onClick={() => {
                                    navigate('/pricing')
                                }}
                            >
                                Purchase a subscription
                            </a>
                        </span>
                    </div>
                </div>
            )}

            {/* Disabled PWA popup */}
            {/* {hasPushFeatureEnabled({
                golferUUID,
            }) &&
                golferData &&
                (golferData?.subscriptionStatus === 'active' ||
                    golferData?.subscriptionStatus === 'in_grace_period') &&
                !golferData?.hasNotificationSubscription && (
                    <button
                        className="fixed bottom-3 right-3 p-2 shadow-2xl rounded-full bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center justify-center z-50"
                        onClick={displayPWACTA}
                    >
                        <MdInstallMobile size={20} />
                    </button>
                )} */}

            {showThankYou && (
                <div className="confetti-container">
                    <ConfettiExplosion
                        zIndex={9999}
                        duration={4000}
                        force={0.8}
                        colors={[
                            '#AAFF00',
                            '#097969',
                            '#023020',
                            '#50C878',
                            '#228B22',
                        ]}
                    />
                </div>
            )}
            <div
                style={{ background: 'white', paddingBottom: '5px' }}
                className="shadow-sm"
            >
                <div
                    style={{
                        width: '90%',
                        maxWidth: '1700px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: 'auto',
                    }}
                >
                    <img
                        src={Logo}
                        alt="logo"
                        style={{ marginLeft: '20px', marginTop: '10px', width: "30px" }}
                        onClick={() => navigate('/welcome')}
                        className=" w-[180px] cursor-pointer"
                    />

                    <div
                        className="relative"
                        style={{
                            marginRight: '5px',
                            marginTop: '20px',
                            width: 'fit-content',
                        }}
                    >
                        <button
                            className="px-4 py-2 bg-[#1e2529] hover:bg-[#263037] text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <RiListSettingsFill
                                style={{ color: 'white', fontSize: '18px' }}
                            />

                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="caret-down"
                                className="w-2 ml-2"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                                />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <ul
                                className="absolute right-0 mt-1 bg-white text-base z-50 py-2 list-none text-left rounded-lg shadow-lg min-w-[200px] border border-gray-200"
                            >
                                <li>
                                    <a
                                        className="text-sm py-2 px-4 font-semibold block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                        href="#"
                                        onClick={() => {
                                            inputRef.current.click()
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        <AiFillEdit
                                            style={{
                                                display: 'inline-block',
                                                marginRight: '5px',
                                            }}
                                        />{' '}
                                        Edit Account Settings{' '}
                                    </a>
                                </li>
                                {hasPushFeatureEnabled({
                                    golferUUID,
                                }) && (
                                    <li>
                                        <a
                                            className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                            href="/welcome"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiHome
                                                className="inline-block"
                                                style={{ marginRight: '5px' }}
                                            />{' '}
                                            Home{' '}
                                        </a>
                                    </li>
                                )}
                                {hasPushFeatureEnabled({
                                    golferUUID,
                                }) && (
                                    <li>
                                        <a
                                            className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                            href="/alerts"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiMessageSquare
                                                className="inline-block"
                                                style={{ marginRight: '5px' }}
                                            />{' '}
                                            Alerts{' '}
                                        </a>
                                    </li>
                                )}
                                <li>
                                    <a
                                        className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                        href="#"
                                        onClick={() => {
                                            logout()
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        <FiLogOut
                                            className="inline-block"
                                            style={{ marginRight: '5px' }}
                                        />{' '}
                                        Logout{' '}
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
