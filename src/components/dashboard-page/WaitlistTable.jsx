import React, { useEffect, useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import {
    FaCheckCircle,
    FaTimesCircle,
    FaQuestionCircle,
    FaRegCheckCircle,
} from 'react-icons/fa'

import GetTimeAgo from '../../utilities/GetTimeAgo'

function CalculatePlayersData(waitlistSubmissions) {
    if (!waitlistSubmissions) return [{}]
    // get all different entry.waitlist_type
    const waitlistTypes = waitlistSubmissions.map(
        (entry) => entry.waitlist_item
    )

    // we have an array of repeating waitlist_types (like city, city, city , course, course for example), we need to form an object with the count of each waitlist_type
    const waitlistTypesCount = waitlistTypes.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
    }, {})

    return waitlistTypesCount
}

const WaitlistTable = ({ type, title }) => {
    // TRACKING DATA
    const [waitlistSubmissions, setWaitlistSubmissions] = useState(null)

    const GetWaitlistEntries = useCallback(
        async (page, limit) => {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''
            const response = await fetch(
                `${global.SERVER_HOST}/api/waitlist_submission?type=${type}&page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            setWaitlistSubmissions(data)
        },
        [type]
    )

    const [page, setPage] = useState(1) // Add this state for the current page
    const limit = 30 // Items per page. Change this to whatever number you want
    const [reachedEnd, setReachedEnd] = useState(false)

    // Add page to your useEffect dependencies so it fetches entries when the page changes
    useEffect(() => {
        GetWaitlistEntries(page, limit)
    }, [GetWaitlistEntries, page])

    useEffect(() => {
        if (waitlistSubmissions) {
            if (waitlistSubmissions?.length < limit) {
                setReachedEnd(true)
            } else {
                setReachedEnd(false)
            }
        }
    }, [waitlistSubmissions])

    const playersData = useMemo(
        () => CalculatePlayersData(waitlistSubmissions),
        [waitlistSubmissions]
    )

    console.log(playersData)

    const [updatingStatusLoading, setUpdatingStatusLoading] = useState(false)
    const [updatingStatusRowId, setUpdatingStatusRowId] = useState()

    const updateWaitlistStatus = async (submissionId, newStatus) => {
        setUpdatingStatusRowId(submissionId)
        setUpdatingStatusLoading(true)
        try {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''
            const response = await fetch(
                `${global.SERVER_HOST}/api/waitlist_submission/status/${submissionId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const updatedSubmission = await response.json()
            console.log('Updated submission:', updatedSubmission)

            // Update the local state to reflect the change
            setWaitlistSubmissions((currentSubmissions) =>
                currentSubmissions.map((submission) =>
                    submission.id === submissionId
                        ? { ...submission, status: newStatus }
                        : submission
                )
            )
        } catch (error) {
            console.error('Error updating waitlist status:', error)
        } finally {
            setUpdatingStatusLoading(false)
        }
    }
    const SendNotificationAfterApproval = async (submissionId) => {
        setUpdatingStatusLoading(true)
        try {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''
            const response = await fetch(
                `${global.SERVER_HOST}/api/waitlist_submission/notify`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ submissionId }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                console.log('Notification sent successfully: ', data.message)

                setWaitlistSubmissions((currentSubmissions) =>
                    currentSubmissions.map((submission) =>
                        submission.id === submissionId
                            ? { ...submission, submitter_email_alerted: true }
                            : submission
                    )
                )
            } else {
                console.error('Failed to send notification: ', data.message)
            }
        } catch (error) {
            console.error('Error sending notification: ', error)
        } finally {
            setUpdatingStatusLoading(false)
        }
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
                    {' '}
                    {title}{' '}
                </h1>

                {/* {chartData && (
                    <div className="px-8">
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height={100}
                        />
                    </div>
                )} */}

                {!waitlistSubmissions && (
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

                {waitlistSubmissions && (
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
                                                Quick Search
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Email
                                            </th>
                                            {/* <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Waitlist Type
                                            </th> */}
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Waitlist Item
                                            </th>
                                            {
                                                // Find all unique keys in extra_details for all entries
                                                Array.from(
                                                    new Set(
                                                        waitlistSubmissions.flatMap(
                                                            (entry) =>
                                                                Object.keys(
                                                                    entry?.extra_details ||
                                                                        {}
                                                                )
                                                        )
                                                    )
                                                ).map((key, index) => (
                                                    <th
                                                        key={index}
                                                        scope="col"
                                                        className="px-6 py-3"
                                                    >
                                                        {key}
                                                    </th>
                                                ))
                                            }
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Submission Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Notify User
                                            </th>

                                            {/* <th scope="col" className="px-6 py-3">
                                            Action
                                        </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitlistSubmissions.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                                                style={{
                                                    opacity:
                                                        updatingStatusLoading &&
                                                        updatingStatusRowId ===
                                                            entry.id
                                                            ? 0.5
                                                            : 1,
                                                    transition:
                                                        'opacity 0.5s ease',
                                                }}
                                            >
                                                <td className="px-6 py-4 flex flex-col">
                                                    {/* Anchor for Google Search: Course Name + Golf Course + City */}
                                                    <a
                                                        href={`https://www.google.com/search?q=${encodeURIComponent(
                                                            entry?.waitlist_item
                                                        )}+golf+course+${encodeURIComponent(
                                                            entry?.extra_details
                                                                ?.city
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline text-gray-800 hover:text-black py-1 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 whitespace-nowrap"
                                                    >
                                                        Course Info
                                                    </a>

                                                    {/* Anchor for Google Search: Course Name + Golf Course + Tee Times + City */}
                                                    <a
                                                        href={`https://www.google.com/search?q=${encodeURIComponent(
                                                            entry?.waitlist_item
                                                        )}+golf+course+${encodeURIComponent(
                                                            entry?.extra_details
                                                                ?.city
                                                        )}+reviews`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline text-gray-800 hover:text-black py-1 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 whitespace-nowrap"
                                                    >
                                                        GMaps Listing
                                                    </a>
                                                </td>

                                                <th
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {entry?.name}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {entry?.email}
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    {entry?.waitlist_type}
                                                </td> */}
                                                <td className="px-6 py-4">
                                                    {entry?.waitlist_item}
                                                </td>
                                                {
                                                    // For each extra_details key, add a cell to the table
                                                    Array.from(
                                                        new Set(
                                                            waitlistSubmissions.flatMap(
                                                                (
                                                                    waitlistSubmission
                                                                ) =>
                                                                    Object.keys(
                                                                        waitlistSubmission?.extra_details ||
                                                                            {}
                                                                    )
                                                            )
                                                        )
                                                    ).map((key, index) => (
                                                        <td
                                                            key={index}
                                                            className="px-6 py-4"
                                                        >
                                                            {
                                                                entry
                                                                    ?.extra_details?.[
                                                                    key
                                                                ]
                                                            }
                                                        </td>
                                                    ))
                                                }
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        entry?.submission_date
                                                    ).toLocaleString()}{' '}
                                                    <span className="text-xs italic">
                                                        (
                                                        {GetTimeAgo(
                                                            new Date(
                                                                entry?.submission_date
                                                            )
                                                        )}
                                                        )
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center">
                                                    <select
                                                        key={entry.id}
                                                        className="block px-3 py-1.5 text-gray-600 font-semibold text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500 mr-2"
                                                        value={entry?.status}
                                                        onChange={(e) =>
                                                            updateWaitlistStatus(
                                                                entry.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Unmarked
                                                        </option>
                                                        <option value="preexisting">
                                                            Preexisting
                                                        </option>
                                                        <option value="added">
                                                            Added
                                                        </option>
                                                        <option value="aborted">
                                                            Aborted
                                                        </option>
                                                    </select>

                                                    {entry?.status ===
                                                        'added' && (
                                                        <FaCheckCircle className="text-green-500" />
                                                    )}
                                                    {entry?.status ===
                                                        'aborted' && (
                                                        <FaTimesCircle className="text-red-500" />
                                                    )}
                                                    {entry?.status ===
                                                        'preexisting' && (
                                                        <FaRegCheckCircle className="text-yellow-500" /> // Icon for preexisting status
                                                    )}
                                                    {!entry?.status && (
                                                        <FaQuestionCircle className="text-gray-500" />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {(entry?.status ===
                                                        'added' ||
                                                        entry?.status ===
                                                            'preexisting') &&
                                                        !entry.submitter_email_alerted && (
                                                            <button
                                                                className="text-gray-800 bg-white hover:bg-gray-100 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm"
                                                                onClick={() =>
                                                                    SendNotificationAfterApproval(
                                                                        entry.id
                                                                    )
                                                                }
                                                            >
                                                                Notify User
                                                            </button>
                                                        )}
                                                    {entry.submitter_email_alerted && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            User Notified{' '}
                                                            <FaCheckCircle className="text-green-500 ml-2" />
                                                        </div>
                                                    )}
                                                </td>

                                                {/* <td className="px-6 py-4">
                                                    <a className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer hover:underline">Delete</a>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex flex-col items-center mt-10 mb-4">
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        Showing{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {(page - 1) * limit || 1}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {(page - 1) * limit +
                                                waitlistSubmissions?.length}
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

export default WaitlistTable
