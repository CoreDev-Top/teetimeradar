import React, { useEffect, useState, useRef, useCallback } from 'react'

import { useLocation } from 'react-router-dom'
import UpdateGolferRecord from '../utilities/UpdateGolferRecord'
import Landingpage from './Landingpage'
import NotificationToast from '../components/general/NotificationToast'

import useAuth from '../hooks/useAuth'

const UnsubscribePage = () => {
    const { token } = useAuth()
    const location = useLocation()
    const [showNotification, setShowNotification] = useState(false)
    const [notificationText, setNotificationText] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const timeoutRef = useRef(null)

    const ShowNotification = useCallback((text, type) => {
        setNotificationText(text)
        setNotificationType(type)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setShowNotification(true)
        timeoutRef.current = setTimeout(() => {
            setShowNotification(false)
        }, 5000)
    }, [])

    useEffect(() => {
        // Extract search parameters
        const searchParams = new URLSearchParams(location.search)
        const userId = searchParams.get('userId')
        console.log(searchParams.get('userId'))

        if (searchParams.get('unsubscribe-email') === 'true') {
            UpdateGolferRecord(
                userId,
                ['golfer_allow_marketing_emails'],
                [false],
                token
            )
            ShowNotification(
                'You have been unsubscribed from all marketing emails',
                'success'
            )
        } else if (searchParams.get('unsubscribe-text') === 'true') {
            UpdateGolferRecord(
                userId,
                ['golfer_allow_marketing_sms'],
                [false],
                token
            )
            ShowNotification(
                'You have been unsubscribed from all marketing texts',
                'success'
            )
        }
    }, [ShowNotification, location.search, token]) // This effect runs every time the search parameters change

    return (
        <div>
            <NotificationToast
                showNotification={showNotification}
                notificationText={notificationText}
                notificationType={notificationType}
                setShowNotification={setShowNotification}
            />
            <Landingpage />
        </div>
    )
}

export default UnsubscribePage
