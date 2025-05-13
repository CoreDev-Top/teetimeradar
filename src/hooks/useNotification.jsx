import clsx from 'clsx'
import React, { useCallback, useRef, useState } from 'react'

export const useNotification = () => {
    const timeoutRef = useRef(null)
    const [notificationText, setNotificationText] = useState('')
    const [notificationType, setNotificationType] = useState('')
    const [showNotification, setShowNotification] = useState(false)
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

    return {
        notificationText,
        notificationType,
        showNotification,
        ShowNotification,
    }
}

export const NotificationDisplay = ({
    showNotification,
    notificationText,
    notificationType,
    setShowNotification,
}) =>
    showNotification && (
        <div
            key={notificationText}
            id="toast-top-right"
            onClick={() => setShowNotification(false)}
            className={clsx(
                'fixed flex items-center w-full max-w-xs p-4 text-white  rounded-lg shadow-xl top-5 right-5  z-10 animate__animated animate__fadeInDown animate__faster',
                notificationType === 'success' && 'bg-blue-500',
                notificationType === 'error' && 'bg-red-500'
            )}
            style={{ zIndex: '99999' }}
            role="alert"
        >
            <div className="text-sm font-normal">{notificationText}</div>
        </div>
    )
