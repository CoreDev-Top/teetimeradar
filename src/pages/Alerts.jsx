import React, { useEffect, useState, useRef } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { auth } from '../firebase-config'

import EditAccountDetails from '../components/EditAccountDetails'
import useAuth from '../hooks/useAuth'
import { Header } from '../components/Header'
import { useNotification, NotificationDisplay } from '../hooks/useNotification'

/**
example message:

{
  "id": 674304,
  "golfer_id": 5421,
  "message_name": "alert",
  "sent_at": "2024-05-29T01:57:29.641Z",
  "message_body": "Hi Carlos, 1 tee time found! <br><br><br>Tee Time: May 29th at 11:20am (America/New_York) &nbsp;-&nbsp; <a href=\"https://app.foreupsoftware.com/index.php/booking/20305/4305#/teetimes\">Book Now</a> (<b>Low Demand</b>)<br>\n Course: Tiden Park<br>\n \n Available Spots: 2<br>\n\n <br><br><a href=\"https://teetimealerts.io/user\">Pause or edit your alerts here</a> <br> <br>",
  "message_category": "alerts",
  "sent_via": "email"
}

*/

const Alerts = () => {
    const navigate = useNavigate()

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

    const [golferUUID, setGolferUUID] = useState(null)
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setGolferUUID(currentUser.uid)
            }
        })
    }, [])

    const inputRef = useRef(null)

    if (loading) {
        return null
    }

    return (
        <div style={{ backgroundColor: '#fafafa' }}>
            <Header
                golferUUID={golferUUID}
                golferData={golferData}
                navigate={navigate}
                showThankYou={false}
                inputRef={inputRef}
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

            {golferData?.email &&
                (golferData?.paying ||
                    golferData?.subscriptionStatus === 'free_trial') && (
                    <div>
                        <MessageList token={token} />
                    </div>
                )}
        </div>
    )
}

export default Alerts

const MessageList = ({ token }) => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        getMessages({ authToken: token })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Failed to get messages')
            })
            .then((data) => {
                console.log('--- messages', data)
                setMessages(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [token])

    return (
        <div className="mx-auto px-4 py-8 w-full max-w-2xl">
            <h1 className="text-2xl font-bold text-navy-900 my-4">
                Alerts (last 10)
            </h1>

            <div className="flex flex-col gap-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="bg-white p-5 rounded-lg shadow-md flex flex-col gap-4"
                    >
                        <div className="text-base font-bold text-navy-900">
                            {message.message_name}
                        </div>
                        {/* eslint-disable-next-line react/self-closing-comp */}
                        <div
                            className="text-sm font-normal text-navy-900 prose"
                            dangerouslySetInnerHTML={{
                                __html: message.message_body,
                            }}
                        ></div>
                        <div>
                            {message.message_link && (
                                <div className="text-sm font-normal text-navy-900">
                                    <a
                                        href={message.message_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-normal text-navy-900 underline"
                                    >
                                        Book Now!
                                    </a>
                                </div>
                            )}
                            <div className="text-sm font-normal text-navy-900">
                                <span className="font-bold">Sent via:</span>{' '}
                                {message.sent_via === 'fcm'
                                    ? 'Push Notification'
                                    : message.sent_via === 'email'
                                    ? 'Email'
                                    : message.sent_via === 'sms'
                                    ? 'SMS'
                                    : message.sent_via}
                            </div>
                            <div className="text-sm font-normal text-navy-900">
                                <span className="font-bold">Date:</span>{' '}
                                {new Date(message.sent_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function getMessages({ authToken }) {
    return fetch(`${global.SERVER_HOST}/api/golfer/alerts`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    })
}
