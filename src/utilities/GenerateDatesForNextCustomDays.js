function GenerateDatesForNextCustomDays(isoDate, days) {
    const dates = []
    for (let i = 0; i < days; i++) {
        const newDate = new Date(isoDate)
        newDate.setDate(newDate.getDate() + i)

        // Format the new date in ISO 8601 format (YYYY-MM-DD)
        const year = newDate.getFullYear()
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
        const day = newDate.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`

        dates.push(formattedDate)
    }
    return dates
}

export default GenerateDatesForNextCustomDays
