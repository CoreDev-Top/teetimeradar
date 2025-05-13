/* eslint-disable */

import React, { useState, useEffect } from 'react'
import { RiAddCircleFill } from 'react-icons/ri'
import { FaRocket, FaGolfBall, FaClock, FaUsers, FaSun } from 'react-icons/fa'
import { IoGolfSharp } from 'react-icons/io5'

import getAlertChanceAndSuggestions from './calculate-alert-chance'

/**
 * This modal is responsible for suggesting ways to increase the likelihood that
 * the customer will receive a tee time alert.
 */
const AlertSuggestionModal = ({
    coursesInSelectedCity,
    preferences,
    alertChance,
    setAlertChance,
    suggestionsToIncreaseAlertChance,
    setSuggestionsToIncreaseAlertChance,
    handleAddNewAlert,
}) => {
    const [selectedSuggestions, setSelectedSuggestions] = useState([])
    const [newPreferences, setNewPreferences] = useState(preferences)

    useEffect(() => {
        setNewPreferences(preferences)
    }, [preferences])

    useEffect(() => {
        const { alertChance: newAlertChance, increaseAlertChanceSuggestions } =
            getAlertChanceAndSuggestions(preferences, coursesInSelectedCity)

        setAlertChance(newAlertChance)
        setSuggestionsToIncreaseAlertChance(increaseAlertChanceSuggestions)
    }, [
        coursesInSelectedCity,
        preferences,
        setAlertChance,
        setSuggestionsToIncreaseAlertChance,
    ])

    const handleCloseModal = () => {
        const { newAlertChance } = getAlertChanceAndSuggestions(
            preferences,
            coursesInSelectedCity
        )

        setAlertChance(newAlertChance)
        setSuggestionsToIncreaseAlertChance([])
    }

    const handleSuggestionClicks = (suggestion, isSelected, index) => {
        // Toggle the selected state
        setSelectedSuggestions((prevSelectedSuggestions) => {
            const newSelectedSuggestions = [...prevSelectedSuggestions]
            newSelectedSuggestions[index] = !newSelectedSuggestions[index]
            return newSelectedSuggestions
        })

        setNewPreferences((prevNewPreferences) => {
            const updatedPreferences = {
                ...prevNewPreferences,
            }

            if (isSelected) {
                if (suggestion?.field === 'courses') {
                    updatedPreferences.courses =
                        updatedPreferences.courses.filter(
                            (course) => course !== suggestion?.newValue
                        )
                } else {
                    updatedPreferences[suggestion?.field] = suggestion?.oldValue
                }
            } else if (suggestion?.field === 'courses') {
                updatedPreferences.courses = [
                    ...updatedPreferences.courses,
                    suggestion?.newValue,
                ]
            } else {
                updatedPreferences[suggestion?.field] = suggestion?.newValue
            }

            return updatedPreferences
        })
    }

    return (
        <div
            className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
            id="lowChanceModal"
            tabIndex="-1"
            aria-labelledby="lowChanceModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog modal-lg relative w-auto pointer-events-none">
                <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                    <div className="modal-header flex flex-shrink-0 items-center justify-between -mb-5 p-4  border-gray-200 rounded-t-md">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body bg-white p-6 rounded-lg shadow">
                        <h2 className="text-3xl font-semibold mb-8 flex items-center">
                            Tips for Getting More Alerts!
                        </h2>
                        <ul className="text-lg leading-relaxed">
                            <li className="mb-5 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center transition-shadow hover:shadow-md">
                                <IoGolfSharp className="text-xl font-semibold mr-2 text-gray-800" />
                                <span>Select a minimum of 3 courses</span>
                            </li>
                            <li className="mb-5 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center transition-shadow hover:shadow-md">
                                <FaClock className="text-xl font-semibold mr-2 text-gray-800" />
                                <span>
                                    Extend your time window to at least 4 hours
                                </span>
                            </li>
                            <li className="mb-5 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center transition-shadow hover:shadow-md">
                                <FaUsers className="text-xl font-semibold mr-2 text-gray-800" />
                                <span>Limit group size to 2+</span>
                            </li>
                            <li className="mb-5 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center transition-shadow hover:shadow-md">
                                <FaSun className="text-xl font-semibold mr-2 text-gray-800" />
                                <span>
                                    Avoid Saturday/Sunday mornings IF possible
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out opacity-80"
                            data-bs-dismiss="modal"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleAddNewAlert(newPreferences, true)
                            }}
                            data-bs-dismiss="modal"
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                        >
                            Create Alert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlertSuggestionModal
