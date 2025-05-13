const FetchGolferData = async (golferUUID, token, ShowNotification) => {
    try {
        const response = await fetch(
            `${global.SERVER_HOST}/api/golfer/uuid/${golferUUID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const jsonData = await response.json()

        if (jsonData?.preferencesList?.length) {
            // preferencesList is an array ocntains json objects, loop through and parse each object
            const preferences = []
            for (let i = 0; i < jsonData.preferencesList.length; i++) {
                preferences.push(JSON.parse(jsonData.preferencesList[i]))
            }
            jsonData.preferencesList = preferences
        }

        return jsonData
    } catch (err) {
        console.error(`error fetching golfer data : ${err.message}`)
        console.log('logging out ')

        // only show notification if ShowNotification is passed in
        if (ShowNotification)
            ShowNotification(
                'Something went wrong with getting your data!',
                'error'
            )
        // Get current location
        const cuurentLocation = window.location.pathname
        // Check if current location is not login
        if (cuurentLocation !== '/login') {
            // Check if its homepage, it its homepage no need to redirect
            if (cuurentLocation !== '/') {
                // Redirect to login page after 4 seconds
                setTimeout(() => {
                    localStorage.removeItem('isUserLoggedIn')
                    window.location.reload()
                }, 4000)
                window.location.href = '/login'
            }
        }
    }
}

export default FetchGolferData
