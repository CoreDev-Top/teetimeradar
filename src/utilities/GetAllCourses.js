async function GetAllCourses() {
    try {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(`${global.SERVER_HOST}/api/course`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        const jsonData = await response.json()
        return jsonData
    } catch (err) {
        console.error(`error fetching all courses : ${err.message}`)
    }
}

export default GetAllCourses
