async function GetNearestCoursesToUserLocation({ userLocation, radius = 50 }) {
    try {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(
            `${global.SERVER_HOST}/api/course/search/location`,
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userLocation,
                    radius,
                }),
            }
        )
        const { courses } = await response.json()
        return { courses }
    } catch (err) {
        console.error(`error searching nearest courses : ${err.message}`)
    }
}

export default GetNearestCoursesToUserLocation
