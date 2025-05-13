import FetchGolferData from './FetchGolferData'

const AddNewAlertPreferences = async (
    golferData,
    setGolferData,
    preferences,
    golferUUID,
    setAddNewAlertError,
    ShowNotification,
    token
) => {
    const random15DigitNumber = Math.floor(Math.random() * 1000000000000000)

    const CheckForDuplicateAlerts = () => {
        setAddNewAlertError('')
        const golferPreferencesList = golferData?.preferencesList

        // check that none of the preferences are the same as preferences state without comparing each element in the object
        let duplicateFound = false
        golferPreferencesList?.forEach((golferPreference) => {
            if (
                JSON.stringify(golferPreference) === JSON.stringify(preferences)
            )
                duplicateFound = true
        })

        return duplicateFound
    }

    if (CheckForDuplicateAlerts()) {
        setAddNewAlertError('You already have an alert with these preferences')
        return
    }

    setAddNewAlertError('')

    preferences.preferences_id = random15DigitNumber
    preferences.alerts_sent = 0

    try {
        await fetch(`${global.SERVER_HOST}/api/golfer/preferences/add`, {
            method: 'PUT',
            cache: 'reload',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uuid: golferData?.uuid,
                preferences,
                golfer_ignore_in_analytics: golferData?.totalAlertsReceived,
            }),
        })
        console.log('%c alert preferences added successfully ', 'color: green')
        ShowNotification('Alert created!', 'success')
        const newGolferData = await FetchGolferData(golferUUID, token)
        setGolferData(newGolferData)
    } catch (e) {
        console.log('error when trying to add alert preferences ')
        console.log(e.message)
        setAddNewAlertError(e.message)
    }
}

export default AddNewAlertPreferences
