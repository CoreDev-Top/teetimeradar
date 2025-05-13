async function SearchCoursesByNameOfCity({ searchString }) {
    try {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(
            `${global.SERVER_HOST}/api/course/search/name-or-city`, // Adjust this to your actual API endpoint
            {
                cache: 'no-cache',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    searchString,
                }),
            }
        )

        const { courses } = await response.json() // Update this line if the backend sends more than just courses
        return { courses }
    } catch (err) {
        console.error(`Error searching courses: ${err.message}`)
        return { courses: [] } // Return an empty array to indicate no results
    }
}

export default SearchCoursesByNameOfCity
