const GetGolfersCountStats = async () => {
    try {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        // Step 1: Send a GET request to the backend route
        const response = await fetch(
            `${global.SERVER_HOST}/api/golfer/golfer-stats`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        // Step 2: Parse the response data as JSON
        const data = await response.json()

        // Step 3: Return the parsed data
        return data
    } catch (e) {
        // Handle any errors
        console.error(
            'Error fetching golfer subscription status count: ',
            e.message
        )
        return null // Or you could return an error object or throw an exception, depending on your error-handling strategy
    }
}

export default GetGolfersCountStats
