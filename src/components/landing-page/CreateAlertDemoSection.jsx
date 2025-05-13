import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateTeeTimeAlertForm from '../tee-time-alert-form/CreateTeeTimeAlertForm'

/**
 * Allow customers to create an alert from the landing page which ingresses
 * them in to sign-up. Save the form submission so when they complete
 * sign-up or sign-in, it automatically creates the tee time alert for them.
 */
const CreateAlertDemoSection = () => {
    const navigate = useNavigate()

    const handleCreateAlert = useCallback(
        async (submittedPreferences) => {
            sessionStorage.setItem(
                'preferences',
                JSON.stringify(submittedPreferences)
            )
            navigate('/join')
        },
        [navigate]
    )

    return (
        <div
            style={{
                maxWidth: '1300px',
                margin: 'auto',
                paddingTop: '60px',
            }}
            className="flex items-center justify-center flex-col-reverse xl:flex-row alert-section-mobile"
        >
            <div className="w-full">
                <CreateTeeTimeAlertForm
                    handleOnSubmission={handleCreateAlert}
                />
            </div>
            <div
                style={{
                    height: '250px',
                    maxWidth: '550px',
                }}
                className="flex flex-col justify-around w-11/12"
            >
                <div className="alert-title"> Create an Alert </div>
                <div className="alert-description">
                    Our software constantly crawls golf booking sites looking
                    for cancellations. Once a tee time opens up that meets your
                    criteria, we will send you an email and/or text with a link
                    to book.
                </div>
            </div>
        </div>
    )
}

export default CreateAlertDemoSection
