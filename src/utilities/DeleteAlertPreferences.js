import FetchGolferData from './FetchGolferData'

const DeleteAlertPreferences = async (
    golferData,
    setGolferData,
    preferences,
    golferUUID,
    ShowNotification,
    token
) => {
    try {
        await fetch(`${global.SERVER_HOST}/api/golfer/preferences/delete`, {
            method: 'PUT',
            cache: 'reload',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: golferData?.id,
                preferences,
            }),
        })
        console.log(
            '%c alert preferences deleted successfully ',
            'color: green'
        )
        const newGolferData = await FetchGolferData(golferUUID, token)
        setGolferData(newGolferData)
        ShowNotification('Alert deleted', 'success')
    } catch (e) {
        console.log('error when trying to delete alert preferences ')
        console.log(e.message)
        ShowNotification('Something went wrong with deleting Alert', 'error')
    } finally {
        // setAddNewAlertLoading(false)
    }
}

export default DeleteAlertPreferences
