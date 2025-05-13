import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import DeleteAlertPreferences from '../utilities/DeleteAlertPreferences'

const CreatedAlerts = ({
    golferData,
    setGolferData,
    golferUUID,
    ShowNotification,
    token,
}) => {
    let selectedAlertPreferences

    return (
        <div>
            {!golferData?.preferencesList.length && (
                <div className="flex justify-center mt-12 mb-64">
                    <div
                        className="block p-6 pt-4 rounded-lg shadow-lg bg-white mt-6 pb-64  "
                        style={{ width: '90%', maxWidth: '540px' }}
                    >
                        <p
                            className="text-gray-400  text-lg flex content-center "
                            style={{ margin: 'auto', marginBlock: '18px' }}
                        >
                            You have not created any alerts yet
                        </p>
                    </div>
                </div>
            )}

            {golferData?.preferencesList?.length > 0 && (
                <div className="flex justify-center flex-col items-center mt-12 mb-64">
                    {golferData?.preferencesList.map((alertPreferences, i) => (
                        <div className="mt-12">
                            {(!alertPreferences?.courses ||
                                !alertPreferences?.dates ||
                                !alertPreferences?.start_times ||
                                !alertPreferences?.end_times) && (
                                <div
                                    className="bg-red-100 p-4 rounded mb-2"
                                    style={{
                                        width: '90vw',
                                        maxWidth: '400px',
                                    }}
                                >
                                    <p className="text-base text-gray-700 font-normal mb-1 flex items-center">
                                        <FaExclamationCircle
                                            className="text-red-500 mr-3"
                                            size={16}
                                        />
                                        Something is wrong with this alert!
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        This alert contains some missing info,
                                        please delete it and create another one
                                    </p>
                                </div>
                            )}
                            <div
                                key={i}
                                className="block p-6 pt-4 rounded-lg shadow-lg bg-white "
                                style={{
                                    width: '90vw',
                                    maxWidth: '400px',
                                }}
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        {' '}
                                        {/* Adjusted here */}
                                        <h5 className="text-gray-500 text-xl leading-tight font-medium">
                                            {' '}
                                            {/* Removed margin-right */}
                                            Active Alert
                                        </h5>
                                        {alertPreferences?.recurring ===
                                            'weekly' && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold text-green-600 bg-green-50">
                                                Recurring Weekly
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="flex  items-center mb-4 mb-4   pb-3"
                                        style={{
                                            borderBottom: '#e7e4e4 1px solid',
                                            marginTop: '-5px',
                                        }}
                                    >
                                        <div className="capitalize ">
                                            Course
                                            {alertPreferences?.courses?.length >
                                            1
                                                ? 's'
                                                : ''}{' '}
                                        </div>
                                        <div className="ml-2 items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                            {alertPreferences?.courses?.map(
                                                (course) => (
                                                    <div className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border">
                                                        {' '}
                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                            {' '}
                                                            {course
                                                                ?.replace(/_/g, ' ')
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="flex  items-center mb-4 mb-4   pb-3"
                                        style={{
                                            borderBottom: '#e7e4e4 1px solid',
                                            marginTop: '-5px',
                                        }}
                                    >
                                        <div className="capitalize">
                                            Player{' '}
                                        </div>
                                        <div className="ml-2 items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                            {alertPreferences?.players?.map(
                                                (player) => (
                                                    <div className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border">
                                                        {' '}
                                                        <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                            {' '}
                                                            {player}+
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="flex  items-center mb-4 mb-4   pb-3"
                                        style={{
                                            borderBottom: '#e7e4e4 1px solid',
                                            marginTop: '-5px',
                                        }}
                                    >
                                        <div className="capitalize">Date</div>
                                        <div className="ml-2 items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                            {alertPreferences?.dates?.map(
                                                (date) => {
                                                    // Create a date object from the date string
                                                    const dateObj = new Date(
                                                        `${date} 12:00`
                                                    )

                                                    // Options to display weekday in long format (e.g., "Monday")
                                                    const options = {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        timeZone:
                                                            'America/Los_Angeles', // specify PST timezone
                                                    }

                                                    // Locale string for the date
                                                    const dateString =
                                                        dateObj.toLocaleDateString(
                                                            'en-US',
                                                            options
                                                        )

                                                    return (
                                                        <div className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border">
                                                            <div className="font-semibold capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-sm text-gray-800 text-xs px-1.5 py-0.5 box-border">
                                                                {dateString}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="flex  items-center mb-4 mb-4   pb-3"
                                        style={{
                                            borderBottom: '#e7e4e4 1px solid',
                                            marginTop: '-5px',
                                        }}
                                    >
                                        <div className="capitalize">Time</div>

                                        <div className="ml-2 w-fit items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                            {alertPreferences?.start_times?.map(
                                                (time) => (
                                                    <div className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border">
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
                                        </div>
                                        <span
                                            style={{
                                                opacity: '0.5',
                                                paddingInline: '5px',
                                            }}
                                        >
                                            to
                                        </span>
                                        <div className=" w-fit items-center cursor-pointer flex flex-wrap justify-start min-h-9 outline-none relative transition-all duration-100 bg-white  shadow-none box-border pl-0.5 text-xl font-semibold text-black w-full">
                                            {alertPreferences?.end_times?.map(
                                                (time) => (
                                                    <div className="flex min-w-0 bg-gray-100 rounded-sm mx-0.5 my-0.5 box-border">
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
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 justify-center mt-4 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                //  UpdateGolferRecord(golferData.id, ["golfer_preferences"], [JSON.stringify(preferences)])
                                                selectedAlertPreferences =
                                                    alertPreferences
                                            }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteModal"
                                            className="inline-block px-10 py-2 bg-red-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-[100%] mb-2"
                                        >
                                            Delete Alert
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div
                className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
                id="deleteModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel2"
                aria-hidden="true"
            >
                <div className="modal-dialog relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5
                                className="text-xl font-medium leading-normal text-gray-800"
                                id="exampleModalLabel"
                            >
                                Delete a tee time alert
                            </h5>
                            <button
                                type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body relative p-4 text-gray-500">
                            You will no longer receive an alert when a Tee Time
                            is available according to your preferences
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // UpdateGolferRecord(golferData.id, ["golfer_preferences"], ['null'])

                                    DeleteAlertPreferences(
                                        golferData,
                                        setGolferData,
                                        selectedAlertPreferences,
                                        golferUUID,
                                        ShowNotification,
                                        token
                                    )
                                }}
                                data-bs-dismiss="modal"
                                className="px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatedAlerts
