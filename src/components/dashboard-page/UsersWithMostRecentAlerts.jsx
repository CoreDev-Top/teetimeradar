import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

const UsersWithMostRecentAlerts = () => {
    const [page, setPage] = useState(1)
    const rowsPerPage = 20
    const [reachedEnd, setReachedEnd] = useState(false)

    // TRACKING DATA
    const [golfersWithMostRecentAlerts, setGolfersWithMostRecentAlerts] =
        useState(null)

    const GetUsersWithMostRecentAlerts = async (pageNumber) => {
        const token = localStorage.getItem('jwt')
            ? localStorage.getItem('jwt')
            : ''
        const response = await fetch(
            `${global.SERVER_HOST}/api/golfer/active-golfers?page=${pageNumber}&limit=${rowsPerPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        setGolfersWithMostRecentAlerts(data)
    }

    useEffect(() => {
        GetUsersWithMostRecentAlerts(page)
    }, [page])

    useEffect(() => {
        if (golfersWithMostRecentAlerts) {
            if (golfersWithMostRecentAlerts?.length < rowsPerPage) {
                setReachedEnd(true)
            } else {
                setReachedEnd(false)
            }
        }
    }, [golfersWithMostRecentAlerts])
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
                    Users with Live Alerts{' '}
                </h1>

                {!golfersWithMostRecentAlerts && (
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

                {golfersWithMostRecentAlerts && (
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
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Email
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                City
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Last Made Alert
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Active Alerts Preferences
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                N° of Alerts Received
                                            </th>
                                            {/* <th scope="col" className="px-6 py-3">
                                            Alerts Received
                                        </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {golfersWithMostRecentAlerts.map(
                                            (golfer, i) => {
                                                if (
                                                    !golfer
                                                        ?.preferencesList?.[0]
                                                )
                                                    return

                                                const lastAlertPreferences =
                                                    JSON.parse(
                                                        golfer
                                                            ?.preferencesList?.[0]
                                                    )
                                                const allAlertsPreferences =
                                                    golfer?.preferencesList?.map(
                                                        (alertPreferences) =>
                                                            JSON.parse(
                                                                alertPreferences
                                                            )
                                                    )
                                                // remove first one since we already have it
                                                const totalNumberOfAlertsReceived =
                                                    allAlertsPreferences.reduce(
                                                        (
                                                            acc,
                                                            alertPreferences
                                                        ) =>
                                                            acc +
                                                            (alertPreferences?.alerts_sent ||
                                                                0),
                                                        0
                                                    )
                                                allAlertsPreferences.shift()

                                                return (
                                                    <tr
                                                        key={i}
                                                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                        >
                                                            {`${golfer?.firstName} ${golfer?.lastName}`}
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            {golfer?.email}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            {golfer?.city}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {new Date(
                                                                golfer?.lastAlertCreatedOn
                                                            ).toLocaleString(
                                                                'en-US',
                                                                {
                                                                    timeZone:
                                                                        'America/Los_Angeles',
                                                                }
                                                            )}
                                                        </td>
                                                        {/* <td className="px-6 py-4">
                                                    <span className=' font-semibold text-gray-900 capitalize ellipsis' style={{ width: '65px', marginBottom: '-5px' }} > {lastAlertPreferences?.['course']?.replace('_', ' ')?.replace('_', ' ')}</span><span style={{ paddingInline: '10px' }} >/</span> <span className='font-medium text-gray-900' style={{ width: '170px' }}  >{new Date((lastAlertPreferences?.['date'] + ' 12:30').toLocaleString('en-US', { timeZone: 'UTC' })).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> <span style={{ paddingInline: '10px' }} >/</span> <span className='font-medium text-gray-900' > {new Date(`2023-02-17T${(lastAlertPreferences?.['start_time']).padStart(2, '0')}:00`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</span> <span style={{ paddingInline: '5px' }} >to</span> <span className='font-medium text-gray-900' > {new Date(`2023-02-17T${(lastAlertPreferences?.['end_time']).padStart(2, '0')}:00`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</span> <span style={{ paddingInline: '10px' }} >/</span> <span className='font-medium text-gray-900'  >{lastAlertPreferences?.['players']} {(lastAlertPreferences?.['players'] > 1) ? 'Players' : 'Player'}</span>
                                                    
                                                </td> */}
                                                        <td
                                                            style={{
                                                                width: '600px',
                                                            }}
                                                        >
                                                            <div
                                                                className="accordion accordion-flush"
                                                                id={`accordionFlushExample${i}`}
                                                            >
                                                                <div
                                                                    className="accordion-item border-l-0 border-r-0 border-b-0 rounded-none bg-white border border-gray-200"
                                                                    style={{
                                                                        borderTop:
                                                                            'none',
                                                                    }}
                                                                >
                                                                    <h2
                                                                        className="accordion-header mb-0 "
                                                                        id={`flush-headingThree${i}`}
                                                                        style={{
                                                                            marginLeft:
                                                                                '-20px',
                                                                        }}
                                                                    >
                                                                        <button
                                                                            className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-xs text-gray-800 text-left bg-white border-0 rounded-none transition focus:outline-none"
                                                                            type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#flush-collapseThree${i}`}
                                                                            aria-expanded="false"
                                                                            aria-controls={`flush-collapseThree${i}`}
                                                                        >
                                                                            <span
                                                                                className=" font-semibold text-gray-900 capitalize ellipsis"
                                                                                style={{
                                                                                    width: '75px',
                                                                                    marginBottom:
                                                                                        '-5px',
                                                                                }}
                                                                            >
                                                                                {/* {lastAlertPreferences?.['course']?.replace('_', ' ')?.replace('_', ' ')} */}
                                                                                {lastAlertPreferences?.courses?.map(
                                                                                    (
                                                                                        course,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                        >
                                                                                            {' '}
                                                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                {' '}
                                                                                                {course
                                                                                                    ?.replace(
                                                                                                        '_',
                                                                                                        ' '
                                                                                                    )
                                                                                                    ?.replace(
                                                                                                        '_',
                                                                                                        ' '
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    paddingInline:
                                                                                        '10px',
                                                                                }}
                                                                            >
                                                                                /
                                                                            </span>
                                                                            <span
                                                                                className="font-medium text-gray-900"
                                                                                style={{
                                                                                    width: '100px',
                                                                                }}
                                                                            >
                                                                                {/* {new Date((lastAlertPreferences?.['date'] + ' 12:30').toLocaleString('en-US', { timeZone: 'UTC' })).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} */}
                                                                                <div className="ml-2 items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                                                                    {lastAlertPreferences?.dates?.map(
                                                                                        (
                                                                                            date,
                                                                                            index
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                            >
                                                                                                {' '}
                                                                                                <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                    {' '}
                                                                                                    {
                                                                                                        date
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    paddingInline:
                                                                                        '10px',
                                                                                }}
                                                                            >
                                                                                /
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {/* {new Date(`2023-02-17T${(lastAlertPreferences?.['start_time'])?.padStart(2, '0')}:00`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })} */}
                                                                                {lastAlertPreferences?.start_times?.map(
                                                                                    (
                                                                                        time,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                        >
                                                                                            {' '}
                                                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                {' '}
                                                                                                {new Date(
                                                                                                    `2023-02-17T${time
                                                                                                        ?.toString()
                                                                                                        ?.padStart(
                                                                                                            2,
                                                                                                            '0'
                                                                                                        )}:00`
                                                                                                ).toLocaleTimeString(
                                                                                                    'en-US',
                                                                                                    {
                                                                                                        hour: 'numeric',
                                                                                                        hour12: true,
                                                                                                    }
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    paddingInline:
                                                                                        '5px',
                                                                                }}
                                                                            >
                                                                                to
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {/* {new Date(`2023-02-17T${(lastAlertPreferences?.['end_time'])?.padStart(2, '0')}:00`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })} */}
                                                                                {lastAlertPreferences?.end_times?.map(
                                                                                    (
                                                                                        time,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                        >
                                                                                            {' '}
                                                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                {' '}
                                                                                                {new Date(
                                                                                                    `2023-02-17T${time
                                                                                                        ?.toString()
                                                                                                        ?.padStart(
                                                                                                            2,
                                                                                                            '0'
                                                                                                        )}:00`
                                                                                                ).toLocaleTimeString(
                                                                                                    'en-US',
                                                                                                    {
                                                                                                        hour: 'numeric',
                                                                                                        hour12: true,
                                                                                                    }
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    paddingInline:
                                                                                        '10px',
                                                                                }}
                                                                            >
                                                                                /
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {/* {lastAlertPreferences?.['players']} {(lastAlertPreferences?.['players'] > 1) ? 'Players' : 'Player'} */}
                                                                                {lastAlertPreferences?.players?.map(
                                                                                    (
                                                                                        players,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                        >
                                                                                            {' '}
                                                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                {' '}
                                                                                                {
                                                                                                    players
                                                                                                }{' '}
                                                                                                {players >
                                                                                                1
                                                                                                    ? 'Players'
                                                                                                    : 'Player'}
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    paddingInline:
                                                                                        '10px',
                                                                                }}
                                                                            >
                                                                                /
                                                                            </span>
                                                                            <span className="font-bold text-gray-900">
                                                                                {lastAlertPreferences?.alerts_sent ||
                                                                                    0}{' '}
                                                                                {lastAlertPreferences?.alerts_sent &&
                                                                                lastAlertPreferences?.alerts_sent >
                                                                                    1
                                                                                    ? ' Alerts Received'
                                                                                    : ' Alert Received'}
                                                                            </span>
                                                                        </button>
                                                                    </h2>
                                                                    <div
                                                                        id={`flush-collapseThree${i}`}
                                                                        className="accordion-collapse collapse"
                                                                        aria-labelledby={`flush-headingThree${i}`}
                                                                        data-bs-parent={`#accordionFlushExample${i}`}
                                                                    >
                                                                        <div
                                                                            className="accordion-body py-4 px-5 text-xs"
                                                                            style={{
                                                                                paddingInline:
                                                                                    '0',
                                                                            }}
                                                                        >
                                                                            {allAlertsPreferences?.map(
                                                                                (
                                                                                    alertPreference,
                                                                                    index
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className=" pb-4 mb-4 border-b-2  border-gray-200 "
                                                                                    >
                                                                                        <span
                                                                                            className=" font-semibold text-gray-900 capitalize ellipsis"
                                                                                            style={{
                                                                                                width: '75px',
                                                                                                marginBottom:
                                                                                                    '-5px',
                                                                                            }}
                                                                                        >
                                                                                            {/* {lastAlertPreferences?.['course']?.replace('_', ' ')?.replace('_', ' ')} */}
                                                                                            {alertPreference?.courses?.map(
                                                                                                (
                                                                                                    course,
                                                                                                    index1
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index1
                                                                                                        }
                                                                                                        className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                                    >
                                                                                                        {' '}
                                                                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                            {' '}
                                                                                                            {course
                                                                                                                ?.replace(
                                                                                                                    '_',
                                                                                                                    ' '
                                                                                                                )
                                                                                                                ?.replace(
                                                                                                                    '_',
                                                                                                                    ' '
                                                                                                                )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                paddingInline:
                                                                                                    '10px',
                                                                                            }}
                                                                                        >
                                                                                            /
                                                                                        </span>
                                                                                        <span
                                                                                            className="font-medium text-gray-900"
                                                                                            style={{
                                                                                                width: '100px',
                                                                                            }}
                                                                                        >
                                                                                            <div className="ml-2 items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                                                                                {alertPreference?.dates?.map(
                                                                                                    (
                                                                                                        date,
                                                                                                        index2
                                                                                                    ) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                index2
                                                                                                            }
                                                                                                            className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                                        >
                                                                                                            {' '}
                                                                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                                {' '}
                                                                                                                {
                                                                                                                    date
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                )}
                                                                                            </div>
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                paddingInline:
                                                                                                    '10px',
                                                                                            }}
                                                                                        >
                                                                                            /
                                                                                        </span>
                                                                                        <span className="font-medium text-gray-900">
                                                                                            {alertPreference?.start_times?.map(
                                                                                                (
                                                                                                    time,
                                                                                                    index3
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index3
                                                                                                        }
                                                                                                        className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                                    >
                                                                                                        {' '}
                                                                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                            {' '}
                                                                                                            {new Date(
                                                                                                                `2023-02-17T${time
                                                                                                                    ?.toString()
                                                                                                                    ?.padStart(
                                                                                                                        2,
                                                                                                                        '0'
                                                                                                                    )}:00`
                                                                                                            ).toLocaleTimeString(
                                                                                                                'en-US',
                                                                                                                {
                                                                                                                    hour: 'numeric',
                                                                                                                    hour12: true,
                                                                                                                }
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                paddingInline:
                                                                                                    '5px',
                                                                                            }}
                                                                                        >
                                                                                            to
                                                                                        </span>
                                                                                        <span className="font-medium text-gray-900">
                                                                                            {/* {new Date(`2023-02-17T${(alertPreference?.['end_time'])?.padStart(2, '0')}:00`).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })} */}
                                                                                            {alertPreference?.end_times?.map(
                                                                                                (
                                                                                                    time,
                                                                                                    index4
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index4
                                                                                                        }
                                                                                                        className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                                    >
                                                                                                        {' '}
                                                                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                            {' '}
                                                                                                            {new Date(
                                                                                                                `2023-02-17T${time
                                                                                                                    ?.toString()
                                                                                                                    ?.padStart(
                                                                                                                        2,
                                                                                                                        '0'
                                                                                                                    )}:00`
                                                                                                            ).toLocaleTimeString(
                                                                                                                'en-US',
                                                                                                                {
                                                                                                                    hour: 'numeric',
                                                                                                                    hour12: true,
                                                                                                                }
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                paddingInline:
                                                                                                    '10px',
                                                                                            }}
                                                                                        >
                                                                                            /
                                                                                        </span>
                                                                                        <span className="font-medium text-gray-900">
                                                                                            {/* {alertPreference?.['players']} {(alertPreference?.['players'] > 1) ? 'Players' : 'Player'} */}
                                                                                            {alertPreference?.players?.map(
                                                                                                (
                                                                                                    players,
                                                                                                    index5
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index5
                                                                                                        }
                                                                                                        className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border"
                                                                                                    >
                                                                                                        {' '}
                                                                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                                                            {' '}
                                                                                                            {
                                                                                                                players
                                                                                                            }{' '}
                                                                                                            {players >
                                                                                                            1
                                                                                                                ? 'Players'
                                                                                                                : 'Player'}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </span>
                                                                                        <span
                                                                                            style={{
                                                                                                paddingInline:
                                                                                                    '10px',
                                                                                            }}
                                                                                        >
                                                                                            /
                                                                                        </span>
                                                                                        <span className="font-bold text-gray-900">
                                                                                            {alertPreference?.alerts_sent ||
                                                                                                0}{' '}
                                                                                            {alertPreference?.alerts_sent &&
                                                                                            alertPreference?.alerts_sent >
                                                                                                1
                                                                                                ? ' Alerts Received'
                                                                                                : ' Alert Received'}
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">
                                                            {
                                                                totalNumberOfAlertsReceived
                                                            }{' '}
                                                            {totalNumberOfAlertsReceived &&
                                                            totalNumberOfAlertsReceived >
                                                                1
                                                                ? ' Alerts Received'
                                                                : ' Alert Received'}
                                                        </td>
                                                    </tr>
                                                )
                                            }
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
                                                golfersWithMostRecentAlerts?.length}
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

export default UsersWithMostRecentAlerts
