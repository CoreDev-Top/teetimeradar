import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'

const AllUsersTable = () => {
    const sortByFields = [
        {
            name: 'Most Created Alerts',
            column: 'golfer_total_alerts_created',
        },
    ]

    const [selectedSortByField, setSelectedSortByField] = useState(
        sortByFields[0]
    )

    const [page, setPage] = useState(1)
    const rowsPerPage = 10
    const [reachedEnd, setReachedEnd] = useState(false)

    // TRACKING DATA
    const [allGolfers, setAllGolfers] = useState(null)

    const GetUsersWithMostRecentAlerts = useCallback(
        async (pageNumber) => {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''
            const response = await fetch(`${global.SERVER_HOST}/api/golfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    page: pageNumber,
                    limit: rowsPerPage,
                    sort_by: selectedSortByField?.column,
                }),
            })

            const data = await response.json()

            setAllGolfers(data)
        },
        [selectedSortByField?.column]
    )

    useEffect(() => {
        GetUsersWithMostRecentAlerts(page)
    }, [GetUsersWithMostRecentAlerts, page])

    useEffect(() => {
        if (allGolfers) {
            if (allGolfers?.length < rowsPerPage) {
                setReachedEnd(true)
            } else {
                setReachedEnd(false)
            }
        }
    }, [allGolfers])

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
                    All Users by
                    <select
                        id="city-select"
                        className="  block w-full px-3 py-1.5 text-gray-600 font-semibold text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500 w-fit inline-block "
                        aria-label="Default select example"
                        value={selectedSortByField?.column}
                        onChange={(e) => {
                            setSelectedSortByField(e.target.value)
                        }}
                    >
                        {sortByFields.map((sortByField, index) => (
                            <option key={index} value={sortByField.column}>
                                {sortByField.name}
                            </option>
                        ))}
                    </select>{' '}
                </h1>

                {!allGolfers && (
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

                {allGolfers && (
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
                                                Total N° of Alerts Created
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                Total N° of Alerts Received
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allGolfers.map((golfer, i) => (
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
                                                    ).toLocaleString('en-US', {
                                                        timeZone:
                                                            'America/Los_Angeles',
                                                    })}
                                                </td>

                                                <td
                                                    className={clsx(
                                                        'px-6 py-4 ',
                                                        selectedSortByField?.column ===
                                                            'totalAlertsCreated' &&
                                                            'font-bold text-gray-900'
                                                    )}
                                                >
                                                    {golfer?.totalAlertsCreated}{' '}
                                                    {golfer?.totalAlertsCreated &&
                                                    golfer?.totalAlertsCreated >
                                                        1
                                                        ? ' Alerts Created'
                                                        : ' Alert Created'}
                                                </td>

                                                <td className="px-6 py-4 font-medium">
                                                    {
                                                        golfer?.totalAlertsReceived
                                                    }{' '}
                                                    {golfer?.totalAlertsReceived &&
                                                    golfer?.totalAlertsReceived >
                                                        1
                                                        ? ' Alerts Received'
                                                        : ' Alert Received'}
                                                </td>
                                            </tr>
                                        ))}
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
                                                allGolfers?.length}
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

export default AllUsersTable
