import React from 'react'
import clsx from 'clsx'

const NotificationToast = ({
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
                'fixed flex items-center w-full max-w-xs p-4 text-white rounded-lg shadow-xl top-5 right-5 z-10 animate__animated animate__fadeInDown animate__faster',
                notificationType === 'success' && 'bg-blue-500',
                notificationType === 'error' && 'bg-red-500'
            )}
            style={{ zIndex: '99999' }}
            role="alert"
        >
            <div className="text-sm font-normal">{notificationText}</div>
        </div>
    )

export default NotificationToast
