const ReverseGeocode = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data.address
    } catch (error) {
        console.log('Failed to reverse geocode:', error)
        return null
    }
}

const GetUserLocation = async () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const address = await ReverseGeocode(latitude, longitude)
                resolve({ position: { latitude, longitude }, address })
            },
            (error) => reject(error), // Reject the promise here
            { enableHighAccuracy: true }
        )
    })

export default GetUserLocation
