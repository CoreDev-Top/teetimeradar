const GetTimeAgo = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date)) {
        return 'Invalid date'
    }

    const now = new Date()
    const secondsPast = (now.getTime() - date.getTime()) / 1000

    if (secondsPast < 60) {
        const wholeSeconds = Math.floor(secondsPast)
        return (
            wholeSeconds + (wholeSeconds === 1 ? ' second ago' : ' seconds ago')
        )
    }

    if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60)

        return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago')
    }

    if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600)
        return hours + (hours === 1 ? ' hour ago' : ' hours ago')
    }

    const daysPast = Math.floor(secondsPast / 86400)

    if (daysPast < 30) {
        if (daysPast === 1) {
            return '1 day ago'
        }
        return `${daysPast} days ago`
    }

    const monthsPast = Math.floor(daysPast / 30)

    if (monthsPast < 12) {
        if (monthsPast === 1) {
            return '1 month ago'
        }
        return `${monthsPast} months ago`
    }

    const yearsPast = Math.floor(monthsPast / 12)

    if (yearsPast === 1) {
        return '1 year ago'
    }
    return `${yearsPast} years ago`
}

export default GetTimeAgo
