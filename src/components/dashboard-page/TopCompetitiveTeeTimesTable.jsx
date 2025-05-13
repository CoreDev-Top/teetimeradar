import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'

const TopCompetitiveTeeTimesTable = () => {
    const [page, setPage] = useState(1)
    const rowsPerPage = 10
    const [reachedEnd, setReachedEnd] = useState(false)

    // TRACKING DATA
    const [mostCompetitiveTeetimesList, setMostCompetitiveTeetimesList] =
        useState(null)
    const GetMostCompetitiveTeeTimes = useCallback(async () => {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(
            `${global.SERVER_HOST}/api/analytics/top-competitive-teetimes`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        setMostCompetitiveTeetimesList(data)
    }, [])

    useEffect(() => {
        GetMostCompetitiveTeeTimes(page)
    }, [GetMostCompetitiveTeeTimes, page])

    useEffect(() => {
        if (mostCompetitiveTeetimesList) {
            if (mostCompetitiveTeetimesList?.length < rowsPerPage) {
                setReachedEnd(true)
            } else {
                setReachedEnd(false)
            }
        }
    }, [mostCompetitiveTeetimesList])

    function formatDateWithDay(dateStr) {
        // Remove ordinal suffixes
        const dateStrWithoutSuffix = dateStr.replace(/(st|nd|rd|th)/, '')

        // Assuming the year is the current year
        const currentYear = new Date().getFullYear()
        const formattedDateStr = `${dateStrWithoutSuffix} ${currentYear}`

        // Create a Date object
        const date = new Date(formattedDateStr)

        // Check for invalid date
        if (date.getTime().isNaN) {
            return 'Invalid Date'
        }

        // Format the date to include the day name
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        })
    }
    return (
        <div>
            <div
                id="chart"
                className="block py-6 pb-0 rounded-xl shadow-sm bg-white mx-auto my-8"
                style={{
                    width: '90%',
                    maxWidth: '1600px',
                    margin: 'auto',
                    marginBlock: '64px',
                    paddingBottom: '10px',
                }}
            >
                <h1 className="text-2xl font-medium text-slate-500 p-6">
                    Most Competitive Tee Times This Week
                </h1>

                {!mostCompetitiveTeetimesList && (
                    <div
                        role="status"
                        className=" pulsing mb-8"
                        style={{ height: '350px' }}
                    >
                        <div
                            className=" bg-gray-200 rounded-xl dark:bg-gray-700  "
                            style={{
                                height: '350px',
                                width: '90%',
                                margin: 'auto',
                            }}
                        />
                    </div>
                )}

                {mostCompetitiveTeetimesList && (
                    <div>
                        <div>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg pb-8">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Time
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Course Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Users Who Received Alert
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mostCompetitiveTeetimesList.map(
                                            (teetime, i) => (
                                                <tr
                                                    key={i}
                                                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                                                >
                                                    <th
                                                        scope="row"
                                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {`${formatDateWithDay(
                                                            teetime?.date
                                                        )} `}
                                                    </th>

                                                    <td className="px-6 py-4">
                                                        {teetime?.time}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {teetime?.course_name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {teetime?.user_count}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex flex-col items-center mt-10 mb-4">
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        Showing{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {(page - 1) * rowsPerPage || 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {(page - 1) * rowsPerPage +
                                                mostCompetitiveTeetimesList?.length}
                                        </span>
                                    </span>
                                    <div className="inline-flex mt-2 xs:mt-0">
                                        <button
                                            className={clsx(
                                                'inline-flex items-center px-4 py-2 text-sm font-medium text-white  rounded-l  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                                                page === 1
                                                    ? 'bg-gray-400 hover:bg-gray-500 pointer-events-none'
                                                    : 'bg-gray-800 hover:bg-gray-900'
                                            )}
                                            onClick={() => {
                                                if (page > 1) setPage(page - 1)
                                            }}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Newer
                                        </button>
                                        <button
                                            className={clsx(
                                                'inline-flex items-center px-4 py-2 text-sm font-medium text-white  border-0 border-l border-gray-700 rounded-r  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                                                reachedEnd
                                                    ? 'bg-gray-400 hover:bg-gray-500 pointer-events-none'
                                                    : 'bg-gray-800 hover:bg-gray-900'
                                            )}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Older
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 ml-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopCompetitiveTeeTimesTable
