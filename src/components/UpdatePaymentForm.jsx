import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import useAuth from '../hooks/useAuth'

const publishableKey = global.DEV
    ? 'pk_test_51KeE6yGVF7jj9PUHQHoi5SRUyHzBGObYpnOrpHGHAiH07nh8OqpbiXozfso14YkjAb4uOSYYxYco8yPOC8ex1S3L00oU2BOWa7'
    : 'pk_live_51Myq0iBSSquRXDH0WBTUgVOlUAdyG7pm7oVjk7h7a5SjNxFBCdDOCYdvVFawiQPwsK47nEadT5uxGVajubgahaT7008YkiDVSn'

const stripePromise = loadStripe(publishableKey)

const UpdatePaymentForm = ({ golferId, ShowNotification }) => {
    const stripe = useStripe()
    const elements = useElements()
    const { token } = useAuth()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(
                `${global.SERVER_HOST}/api/stripe/start-update-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ golferId }),
                }
            )

            if (!response.ok) {
                console.error(
                    'Server responded with an error:',
                    response.statusText
                )
                return ShowNotification(
                    `Update failed! Please recheck your info or contact support (${response.statusText})`,
                    'error'
                )
            }

            const responseData = await response.json()
            const { clientSecret } = responseData

            if (clientSecret) {
                const result = await stripe.confirmCardSetup(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                })

                if (result.error) {
                    console.error(result.error.message)
                    return ShowNotification(
                        `Update failed! contact support. (${result.error.message})`,
                        'error'
                    )
                }

                const UpdatePaymentMethod = await fetch(
                    `${global.SERVER_HOST}/api/stripe/update-default-payment-method`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            golferId,
                            paymentMethodId: result.setupIntent.payment_method,
                        }),
                    }
                )

                if (!UpdatePaymentMethod.ok) {
                    console.error(
                        'Server responded with an error:',
                        UpdatePaymentMethod.statusText
                    )
                    return ShowNotification(
                        `Update failed! Please recheck your info or contact support (${UpdatePaymentMethod.statusText})`,
                        'error'
                    )
                }
                console.log('Payment method updated successfully')
                return ShowNotification('Payment method updated!', 'success')
            }
        } catch (error) {
            console.error('Error occurred: ', error.message)
            return ShowNotification(
                `Update failed, contact support. (${error.message})`,
                'error'
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 px-4">
            <div className="w-auto">
                <div className="flex items-center">
                    <CardElement className="w-96 border-2 p-2 mr-2" />
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                        disabled={!stripe}
                    >
                        Update
                    </button>
                </div>
            </div>
        </form>
    )
}

const UpdatePayment = ({ golferId, ShowNotification }) => (
    <Elements stripe={stripePromise}>
        <UpdatePaymentForm
            golferId={golferId}
            ShowNotification={ShowNotification}
        />
    </Elements>
)

export default UpdatePayment
