import React from 'react'
import Select from 'react-select'
import { customStyles } from './select-form-custom-styles'
import GenerateDatesForNextCustomDays from '../../../utilities/GenerateDatesForNextCustomDays'

/**
 * Returns the rest of the select options for a tee time alert.
 */
const convertHourToDisplay = (hour) => {
    let displayHour = hour
    if (hour === 12) {
        displayHour = `${hour}:00 PM`
    } else if (hour > 12) {
        displayHour = `${hour - 12}:00 PM`
    } else {
        displayHour = `${hour}:00 AM`
    }
    return displayHour
}

const hours = []
for (let i = 5; i <= 19; i++) {
    hours.push(i)
}

const removeAvailableHoursBasedOnTime = (selectedHour, isAfter) => {
    if (!selectedHour) {
        return hours
    }

    const hoursIndex = hours.findIndex((hour) => hour === selectedHour)

    if (isAfter) {
        return hours.slice(hoursIndex + 1)
    }

    return hours.slice(0, hoursIndex)
}

const StartTimeSelect = ({ preferences, setPreferences }) => {
    const currentValue = preferences.start_times
        ? {
              value: preferences.start_times[0],
              label: convertHourToDisplay(preferences.start_times[0]),
          }
        : null

    return (
        <div className="mb-3">
            <label className="form-label alert-form-select-label inline-block mb-2 text-gray-700 text-md">
                Start Time
            </label>
            <Select
                key={
                    preferences.start_times
                        ? preferences.start_times[0]
                        : 'empty'
                }
                value={currentValue}
                styles={customStyles}
                onChange={(selectedOption) => {
                    setPreferences({
                        ...preferences,
                        start_times: [selectedOption.value],
                    })
                }}
                placeholder="Select start time"
                isSearchable={false}
                name="start_times"
                options={removeAvailableHoursBasedOnTime(
                    preferences.end_times?.[0],
                    false
                ).map((hour) => ({
                    value: hour,
                    label: convertHourToDisplay(hour),
                }))}
            />
        </div>
    )
}

const EndTimeSelect = ({ preferences, setPreferences }) => {
    const currentValue = preferences.end_times
        ? {
              value: preferences.end_times[0],
              label: convertHourToDisplay(preferences.end_times[0]),
          }
        : null

    return (
        <div className="mb-3">
            <label className="form-label alert-form-select-label inline-block mb-2 text-gray-700 text-md">
                End Time
            </label>
            <Select
                key={preferences.end_times ? preferences.end_times[0] : 'empty'}
                value={currentValue}
                className="block w-full py-1.5 text-lg text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500"
                styles={customStyles}
                onChange={(selectedOption) => {
                    setPreferences({
                        ...preferences,
                        end_times: [selectedOption.value],
                    })
                }}
                placeholder="Select end time"
                isSearchable={false}
                name="end_times"
                options={removeAvailableHoursBasedOnTime(
                    preferences?.start_times?.[0] || 6,
                    true
                ).map((hour) => ({
                    value: hour,
                    label: convertHourToDisplay(hour),
                }))}
            />
        </div>
    )
}

const PlayersSelect = ({ preferences, setPreferences }) => {
    const playerOptions = [
        { value: '1', label: '1+ player(s)' },
        { value: '2', label: '2+ players' },
        { value: '3', label: '3+ players' },
        { value: '4', label: '4 players' },
    ]
    const selectedValue = preferences.players
        ? {
              value: preferences.players[0],
              label: `${preferences.players[0]}+ player(s)`,
          }
        : null

    return (
        <div className="mb-3">
            <label className="form-label alert-form-select-label inline-block mb-2 text-gray-700 text-md">
                Players
            </label>
            <Select
                className="block w-full py-1.5 text-lg text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500"
                styles={customStyles}
                placeholder="Select players"
                isSearchable={false}
                value={selectedValue}
                onChange={(selectedOption) =>
                    setPreferences({
                        ...preferences,
                        players: [selectedOption.value],
                    })
                }
                name="players"
                options={playerOptions}
            />
        </div>
    )
}

const DatesSelect = ({ preferences, selectedCourses, setPreferences }) => {
    function toISODateString(date) {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day} 12:00` // Append a fixed time
    }
    // Format today's date in ISO format
    const todayDate = toISODateString(new Date())

    // Updated formatDateLabel to handle ISO format dates
    function formatDateLabel(isoDate) {
        const date = new Date(`${isoDate} 12:30`)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const datesOptions = GenerateDatesForNextCustomDays(
        todayDate,
        determineDays(selectedCourses)
    ).map((date) => ({
        value: date,
        label: formatDateLabel(date),
    }))
    const selectedValue = preferences.dates
        ? {
              value: preferences.dates[0],
              label: formatDateLabel(preferences.dates[0]),
          }
        : null

    function determineDays() {
        return 10 // Set default to 10 days
    }

    return (
        <div className="mb-3">
            <label className="form-label alert-form-select-label inline-block mb-2 text-gray-700 text-md">
                Date
            </label>
            <Select
                className="block w-full py-1.5 text-lg text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500"
                styles={customStyles}
                placeholder="Select date"
                isSearchable={false}
                onChange={(selectedOption) =>
                    setPreferences({
                        ...preferences,
                        dates: [selectedOption.value],
                    })
                }
                name="dates"
                value={selectedValue}
                options={datesOptions}
            />
        </div>
    )
}

const AlertSelects = ({ preferences, setPreferences }) => (
    <div>
        <StartTimeSelect
            preferences={preferences}
            setPreferences={setPreferences}
        />
        <EndTimeSelect
            preferences={preferences}
            setPreferences={setPreferences}
        />
        <PlayersSelect
            preferences={preferences}
            setPreferences={setPreferences}
        />
        <DatesSelect
            preferences={preferences}
            setPreferences={setPreferences}
        />
    </div>
)

export default AlertSelects
