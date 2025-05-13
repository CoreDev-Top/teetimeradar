async function GetNearestCoursesToZipCode({ zipCode, radius = 50 }) {
    try {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(
            `${global.SERVER_HOST}/api/course/search/zipcode`,
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    zipCode,
                    radius,
                }),
            }
        )
        const { courses, zipCodeData } = await response.json()
        return { courses, zipCodeData }
    } catch (err) {
        console.error(`error searching nearest courses : ${err.message}`)
    }
}

export default GetNearestCoursesToZipCode
