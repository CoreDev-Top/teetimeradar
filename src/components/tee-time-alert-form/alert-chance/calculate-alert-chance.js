/**
 * Calculates the likelihood that a customer will get an alert based on the player count that the customer selected.
 * @param {number} playerCount
 * @returns
 */
const calculatePointsForPlayerCount = (playerCount) => {
    let points = 0
    let suggestions = []

    if (playerCount <= 1) points += 2
    else if (playerCount <= 2) points += 1
    else if (playerCount <= 3) {
        suggestions = [
            {
                message: `Remove 1 player spot (${playerCount - 1} spots left)`,
                field: 'players',
                oldValue: [playerCount],
                newValue: [playerCount - 1],
            },
        ]
    } else if (playerCount <= 4) {
        suggestions = [
            {
                message: `Remove 2 player spots (${
                    playerCount - 2
                } spots left)`,
                field: 'players',
                oldValue: [playerCount],
                newValue: [playerCount - 2],
            },
        ]
    }

    return {
        points,
        suggestions,
    }
}

/**
 * Calculates the likelihood that a customer will get an alert based on the courses
 * that the customer selected.
 *
 * @param {*} submittedCourses
 * @param {*} coursesInSelectedCity
 * @returns
 */
const calculatePointsForCourseActivity = (
    submittedCourses,
    coursesInSelectedCity
) => {
    let points = 0
    let suggestions = []

    let highActivityCourses = 0
    let lowActivityCourses = 0

    submittedCourses.forEach((courseName) => {
        coursesInSelectedCity.forEach((course) => {
            if (course.course_name === courseName) {
                if (course.course_activity_level === 'high') {
                    highActivityCourses += 1
                }
                if (course.course_activity_level === 'low') {
                    lowActivityCourses += 1
                }
            }
        })
    })

    if (highActivityCourses > 0) points += highActivityCourses
    if (lowActivityCourses > 0) points -= lowActivityCourses

    if (submittedCourses.length < 3 || highActivityCourses <= 1) {
        // Get high activity courses in the current city that the user didn't select
        const highActivityCoursesInCity = coursesInSelectedCity
            .filter((course) => course.course_activity_level === 'high')
            .map((course) => course)
        const highActivityCoursesNotSelected = highActivityCoursesInCity.filter(
            (course) => !submittedCourses.includes(course?.course_name)
        )

        // Get a random 2 high activity courses
        const randomHighActivityCourses = highActivityCoursesNotSelected
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)

        if (randomHighActivityCourses.length > 0) {
            suggestions = randomHighActivityCourses.map((course) => ({
                message: `Add ${course?.course_fullname} high activity course`,
                field: 'courses',
                newValue: course?.course_name,
            }))
        }
    }

    return {
        points,
        suggestions,
    }
}

const convertHourToReadable = (hour) => {
    let displayHour
    if (hour === 12) {
        displayHour = `${hour}:00 PM`
    } else if (hour > 12) {
        displayHour = `${hour - 12}:00 PM`
    } else {
        displayHour = `${hour}:00 AM`
    }
    return displayHour
}

const generateLowChanceTimeSuggestions = (
    submittedStartTime,
    submittedEndTime,
    hours
) => {
    const startHour = Math.max(0, submittedStartTime - hours)
    const endHour = Math.min(23, submittedEndTime + hours)
    const displayStartHour = convertHourToReadable(startHour)
    const displayEndHour = convertHourToReadable(endHour)

    return [
        {
            message: `Expand start time by ${hours} hours (${displayStartHour})`,
            field: 'start_times',
            oldValue: [submittedStartTime],
            newValue: [startHour],
        },
        {
            message: `Expand end time by ${hours} hours (${displayEndHour})`,
            field: 'end_times',
            oldValue: [submittedEndTime],
            newValue: [endHour],
        },
    ]
}

/**
 * Calculates the likelihood that a customer will get an alert based on the time window selected
 * by the customer.
 *
 * @param {*} timeWindow
 * @param {*} submittedStartTime
 * @param {*} submittedEndTime
 * @returns
 */
const calculatePointsForTimeWindow = (
    timeWindow,
    submittedStartTime,
    submittedEndTime
) => {
    let points = 0
    let suggestions = []

    if (timeWindow >= 6) {
        points += 2
    } else if (timeWindow >= 5) {
        points += 1
    } else if (timeWindow <= 4) {
        points += 0.5
        suggestions = generateLowChanceTimeSuggestions(
            submittedStartTime,
            submittedEndTime,
            2
        )
    } else if (timeWindow <= 2) {
        suggestions = generateLowChanceTimeSuggestions(
            submittedStartTime,
            submittedEndTime,
            4
        )
    }

    return {
        points,
        suggestions,
    }
}

/**
 * Based on the total points, an alert chance is returned.
 * @returns
 */
const getAlertChanceBasedOnPoints = (totalPoints) => {
    let alertChance = 'Low'

    if (totalPoints >= 5) {
        alertChance = 'High'
    } else if (totalPoints >= 3) {
        alertChance = 'Medium'
    }

    return alertChance
}

/**
 * Calculates the chance of the customer receiving a tee time alert. It also returns suggestions
 * on how to increase the alert chance.
 * @param {*} submittedPreferences
 * @param {*} generateSuggestions
 * @returns
 */
const getAlertChanceAndSuggestions = (
    submittedPreferences,
    coursesInSelectedCity
) => {
    const noAlertAndSuggestions = {
        alertChance: '',
        increaseAlertChanceSuggestions: [],
    }

    if (!submittedPreferences) {
        return noAlertAndSuggestions
    }

    if (Object.keys(submittedPreferences).length < 5) {
        return noAlertAndSuggestions
    }

    const submittedEndTime = submittedPreferences.end_times?.[0] || 0
    const submittedStartTime = submittedPreferences.start_times?.[0] || 0
    const timeWindow = submittedEndTime - submittedStartTime

    const submittedCourses = submittedPreferences.courses || []
    const submittedPlayerCount = submittedPreferences?.players?.[0] || 0

    const playerCount = Number(submittedPlayerCount)

    if (!submittedCourses.length) {
        return noAlertAndSuggestions
    }

    if (timeWindow <= 0) {
        return noAlertAndSuggestions
    }

    if (!playerCount) {
        return noAlertAndSuggestions
    }

    const { points: timeWindowPoints, suggestions: timeWindowSuggestions } =
        calculatePointsForTimeWindow(submittedStartTime, submittedEndTime)

    const { points: coursePoints, suggestions: courseSuggestions } =
        calculatePointsForCourseActivity(
            submittedCourses,
            coursesInSelectedCity
        )

    const { points: playerCountPoints, suggestions: playerCountSuggestions } =
        calculatePointsForPlayerCount(playerCount)

    const totalPoints =
        timeWindowPoints +
        coursePoints +
        playerCountPoints +
        submittedCourses.length
    return {
        alertChance: getAlertChanceBasedOnPoints(totalPoints),
        increaseAlertChanceSuggestions: [
            ...timeWindowSuggestions,
            ...courseSuggestions,
            ...playerCountSuggestions,
        ],
    }
}

export default getAlertChanceAndSuggestions
