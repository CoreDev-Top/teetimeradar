import { getToken } from 'firebase/messaging'
import { UAParser } from 'ua-parser-js'
import { messaging } from './firebase-config'
import { getDeviceInfo } from './utilities/pwa'

export const requestNotificationsPermission = (
    authToken,
    hasNotificationSubscription,
    onSuccess
) => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications.')
        return
    }

    if (Notification.permission === 'granted' && hasNotificationSubscription) {
        console.log('Notification permission already granted.')
        return
    }

    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.')
            getFCMToken(authToken, hasNotificationSubscription, onSuccess)
        } else {
            console.log('Unable to get permission to notify.')
        }
    })
}

const { pwa } = getDeviceInfo(new UAParser())

export const shouldShowNotificationPrompt = (golferData) => {
    if (pwa.isStandalone(window)) {
        if (!('Notification' in window)) {
            return false
        }

        if (
            Notification.permission === 'granted' &&
            golferData?.hasNotificationSubscription
        ) {
            return false
        }

        return true
    }

    return (
        !golferData?.hasNotificationSubscription &&
        (golferData?.subscriptionStatus === 'active' ||
            golferData?.subscriptionStatus === 'in_grace_period')
    )
}

function getFCMToken(authToken, hasNotificationSubscription, onSuccess) {
    console.log(`Getting FCM token...`)

    if (!window.serviceWorkerRegistrationObj) {
        console.log('Service Worker not registered.')
        return
    }

    getToken(messaging, {
        serviceWorkerRegistration: window.serviceWorkerRegistrationObj,
        vapidKey:
            'BEOsNOxtjyKxsFdbfddhl89mbwroVXOoA3-ZOl4ErFiAPTVLrmaSWFjNIJQuWf40YC-vFZJ4ljVSV2c3ip4Qucg',
    })
        .then((currentToken) => {
            if (currentToken) {
                console.log(`FCM Token: ${currentToken}`)

                // Send the token to the server
                fetch(`${global.SERVER_HOST}/api/golfer/fcm-token`, {
                    method: 'PUT',
                    cache: 'reload',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        fcm_token: currentToken,
                    }),
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log('FCM token sent to server.')

                            if (onSuccess) {
                                onSuccess()
                            }
                        } else {
                            console.log('FCM token not sent to server.')
                        }
                    })
                    .catch((err) => {
                        console.log('Error sending FCM token to server.', err)
                    })
            } else {
                // Show permission request UI
                console.log(
                    'No registration token available. Request permission to generate one.'
                )
                console.log(
                    'No registration token available. Request permission to generate one.'
                )

                requestNotificationsPermission(
                    authToken,
                    hasNotificationSubscription,
                    onSuccess
                )
            }
        })
        .catch((err) => {
            console.log(
                `An error occurred while retrieving token, ${err.message}`
            )
            console.log('An error occurred while retrieving token. ', err)
        })
}
