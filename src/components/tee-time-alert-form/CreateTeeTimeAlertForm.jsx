import React, { useEffect, useState, useRef, useCallback } from 'react'
import { IoTimeSharp } from 'react-icons/io5'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FiInfo } from 'react-icons/fi'

import CityWaitlistModal from './waitlist/CityWaitlistModal'
import CourseWaitlistModal from './waitlist/CourseWaitlistModal'
import SearchCourses from './select/SearchCourses'
import AlertSelects from './select/AlertSelects'
import AlertSuggestionModal from './alert-chance/AlertSuggestionModal'
import LoadingAlertForm from './LoadingAlertForm'
import GetNearestCoursesToZipCode from '../../utilities/GetNearestCoursesToZipCode'
import GetNearestCoursesToUserLocation from '../../utilities/GetNearestCoursesToUserLocation'
import GetUserLocation from '../../utilities/GetUserLocation'
import SearchCoursesByNameOfCity from '../../utilities/SearchCoursesByNameOfCity'

/**
 * This is responsible for all the logic to create a tee time alert for a customer.
 *
 * @param {*} handleOnSubmission Responsible for handling the logic on what to do with the submitted preferences of the customer
 */
const CreateTeeTimeAlertForm = ({ handleOnSubmission, ShowNotification }) => {
    const [isLoadingForGetCourses, setIsLoadingForGetCourses] = useState(true)
    const [selectedCourses, setSelectedCourses] = useState([])
    const [coursesOptions, setCoursesOptions] = useState([])
    const [preferences, setPreferences] = useState({})
    const [addNewAlertError, setAddNewAlertError] = useState('')
    const [alertChance, setAlertChance] = useState('')
    const [
        suggestionsToIncreaseAlertChance,
        setSuggestionsToIncreaseAlertChance,
    ] = useState([])

    const lowChanceModalRef = useRef(null)
    const createNewAlertFormRef = useRef(null)

    useEffect(() => {
        const GetCoursesData = async () => {
            setIsLoadingForGetCourses(false)
        }
        GetCoursesData()
    }, [])

    useEffect(() => {
        setPreferences({})
        setSelectedCourses([])
    }, [])

    const handleCreateNewAlert = useCallback(
        async (submittedPreferences, lowChanceModalOpened) => {
            // only proceed if preferences contain 5 fields, other wise show error please fill all fields
            if (!(submittedPreferences?.courses?.length > 0)) {
                setAddNewAlertError('Please choose a course!')
                return
            }
            const requiredFields = [
                'start_times',
                'end_times',
                'players',
                'dates',
                'courses',
            ]
            const allFieldsExist = requiredFields.every(
                (field) => field in submittedPreferences
            )

            if (!allFieldsExist) {
                setAddNewAlertError('Please fill all fields!')
                return
            }

            // make sure all preferences values are not empty or null, and if the value is an array, make sure it has at least one element
            for (const [key, value] of Object.entries(submittedPreferences)) {
                if (key === 'alerts_sent') return
                if (value === null || value === '') {
                    setAddNewAlertError('Please fill all fields!')
                    return
                }
                if (Array.isArray(value) && value.length === 0) {
                    setAddNewAlertError('Please fill all fields!')
                    return
                }
            }

            // if alert chances are low, open modal lowChanceModalRef

            if (!lowChanceModalOpened) {
                //  if (alertChance === 'Low' || alertChance === 'Medium') {
                lowChanceModalRef?.current.click()
                return
                //  }
            }

            handleOnSubmission(submittedPreferences, setAddNewAlertError)
            setSelectedCourses([])
            setPreferences({})
        },
        [handleOnSubmission /* , alertChance */]
    )

    const debounceTimer = useRef(null) // Use useRef instead of useState

    const [searchingCoursesInProgress, setSearchingCoursesInProgress] =
        useState(false)

    const [userLocation, setUserLocation] = useState(null)
    const [searchString, setSearchString] = useState('')
    const [zipCode, setZipCode] = useState('')

    const [selectedTypeOfSearch, setSelectedTypeOfSearch] = useState('zipCode') // 'zipCode' or 'userLocation' or 'searchString'
    useEffect(() => {
        setSearchingCoursesInProgress(false)
        setCoursesOptions([])
    }, [selectedTypeOfSearch])

    const [gettingUserLocationInProgress, setGettingUserLocationInProgress] =
        useState(false)
    const HandleGettingUserLocation = async () => {
        try {
            setGettingUserLocationInProgress(true)
            const { address, position } = await GetUserLocation()
            setUserLocation({ address, position })
        } catch (error) {
            console.log('Error getting user location:', error.message) // Log the error to the console here
            ShowNotification(
                error.message === 'User denied Geolocation'
                    ? 'Please allow location access to use this feature!'
                    : error.message,
                'error'
            )
        } finally {
            setGettingUserLocationInProgress(false)
        }
    }

    useEffect(() => {
        if (selectedTypeOfSearch === 'userLocation' && !userLocation?.position)
            return
        if (
            selectedTypeOfSearch === 'zipCode' &&
            !(zipCode?.trim()?.length === 5)
        )
            return

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(async () => {
            setSearchingCoursesInProgress(true)

            let newAdresse = ''
            let courses = null
            if (selectedTypeOfSearch === 'userLocation') {
                const response = await GetNearestCoursesToUserLocation({
                    userLocation,
                })
                courses = response?.courses
                const keys = [
                    'state',
                    'city',
                    'neighbourhood',
                    'road',
                    'postcode',
                ]
                const addressParts = keys
                    .filter((key) => key in userLocation.address)
                    .map((key) => userLocation.address[key])
                newAdresse = addressParts.join(' ')
            } else if (selectedTypeOfSearch === 'zipCode') {
                const response = await GetNearestCoursesToZipCode({ zipCode })
                newAdresse =
                    response?.zipCodeData?.zipCode !== undefined &&
                    response?.zipCodeData?.address !== undefined
                        ? `${response?.zipCodeData?.zipCode} ${response?.zipCodeData?.address}`
                        : ''
                courses = response?.courses
            } else if (selectedTypeOfSearch === 'searchString') {
                const response = await SearchCoursesByNameOfCity({
                    searchString,
                })
                newAdresse = ''
                courses = response?.courses
            }
            /*    var courseflaggingReason = null
            if (course.course_flagging_reason == 'LOW_SUCCESS_RATE') {
                courseflaggingReason = '(Temproarily Unavailable)'
            }
            else if (course.course_flagging_reason == 'NO_LOGS') {
                courseflaggingReason = '(Temproarily Unavailable)'
            }
            else if (course.course_flagging_reason == 'NO_TEE_TIMES') {
                courseflaggingReason = '(Course Closed)'
            }
            */

            const transformedCoursesOptions = courses.map((course) => ({
                value: course.course_id,
                label: `${course.course_fullname}`,
                course_activity_level: course.course_activity_level,
                course_name: course.course_name,
                course_flagging_reason: course.course_flagging_reason,
                course_flagging_reason_tag:
                    course.course_flagging_reason === 'NO_TEE_TIMES'
                        ? 'Course Closed'
                        : course.course_flagging_reason &&
                          'Temproarily Unavailable',
                course_flagging_reason_explanation:
                    course.course_flagging_reason === 'NO_TEE_TIMES'
                        ? 'For winter or undergoing maintenance'
                        : course.course_flagging_reason &&
                          'We are experiencing technical updates',

                is_ezlinks: course.is_ezlinks,
                course_distance: course.course_distance,
            }))

            if (newAdresse?.length > 0) {
                transformedCoursesOptions.unshift({
                    value: 'address',
                    label: newAdresse,
                })
            }

            // transformedCoursesOptions.push({
            //     value: 'waitlist',
            //     label: "Don't see your favorite course? Request it now",
            // })

            setCoursesOptions(transformedCoursesOptions) // Update the state
            setSearchingCoursesInProgress(false)
        }, 300)

        return () => {
            clearTimeout(debounceTimer.current)
        }
    }, [
        zipCode,
        userLocation,
        userLocation?.position,
        searchString,
        selectedTypeOfSearch,
    ])

    const alertForm = (
        <form className="options  mt-2 p-6 pt-4" ref={createNewAlertFormRef}>
            <SearchCourses
                zipCode={zipCode}
                setZipCode={setZipCode}
                searchString={searchString}
                setSearchString={setSearchString}
                selectedTypeOfSearch={selectedTypeOfSearch}
                setSelectedTypeOfSearch={setSelectedTypeOfSearch}
                HandleGettingUserLocation={HandleGettingUserLocation}
                searchingCoursesInProgress={searchingCoursesInProgress}
                gettingUserLocationInProgress={gettingUserLocationInProgress}
                coursesOptions={coursesOptions}
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                preferences={preferences}
                setPreferences={setPreferences}
            />

            <AlertSelects
                selectedCourses={selectedCourses}
                preferences={preferences}
                setPreferences={setPreferences}
            />

            <div className="form-check form-switch my-10 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-xs">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-xs"
                        checked={preferences?.recurring === 'weekly'}
                        onChange={() => {
                            if (preferences?.recurring === 'weekly') {
                                // Here we're creating a new object with all the old preferences, but with 'recurring' set to null
                                setPreferences({
                                    ...preferences,
                                    recurring: null,
                                })
                            } else {
                                // Here we're creating a new object with all the old preferences, but with 'recurring' set to 'weekly'
                                setPreferences({
                                    ...preferences,
                                    recurring: 'weekly',
                                })
                            }
                        }}
                        style={{ transform: 'scale(1.5)' }}
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                    />
                    <label
                        className="form-check-label inline-block pl-10 text-gray-700"
                        htmlFor="flexSwitchCheckDefault"
                    >
                        Make Alert Recurring -{' '}
                        <b className="text-gray-800">Weekly</b>
                    </label>
                    <div className="inline-block relative">
                        <FiInfo
                            className="ml-2 text-gray-500 cursor-pointer"
                            data-tooltip-id="recurringTooltip"
                            data-tooltip-content="e.g., You'll receive alerts for every Friday, week after week, without the hassle of setting up a new alert every week."
                            aria-label="Info"
                        />
                    </div>
                </div>
                <ReactTooltip id="recurringTooltip" />
            </div>

            {/* {alertChance && (
                <p
                    className={`  text-gray-600 ${alertChance === 'Low' && 'bg-rose-100'
                        } ${alertChance === 'High' && 'bg-green-100'} ${alertChance === 'Medium' && 'bg-orange-100'
                        } bg-rose-100 rounded-sm text-sm text-center w-fit px-2 py-1 mx-auto mb-6 mt-12`}
                >
                    {' '}
                    <span className="font-bold">{alertChance}</span> chance of
                    getting an alert{' '}
                </p>
            )} */}

            {/* 
           {preferences?.end_times?.[0]- preferences?.start_times?.[0] < 3 && 
           <div className="mb-4 bg-white border border-gray-200 text-gray-800 p-3 rounded-lg flex items-center pl-4 border-l-4 border-gray-300" role="alert">
                <AiOutlineInfoCircle className="mr-1 text-gray-500 text-lg" />
                <div>
                    <p className="font-semibold text-sm">Narrow time range</p>
                    <p className="text-sm">Select a wider time range for beter chances to receive alerts</p>
                </div>
            </div>
            }

            {preferences?.courses?.length < 2 &&
            <div className="mb-8 bg-white border border-gray-200 text-gray-800 p-3 rounded-lg flex items-center pl-4 border-l-4 border-gray-300" role="alert">
                <AiOutlineInfoCircle className="mr-1 text-gray-500 text-lg" />
                <div>
                    <p className="font-semibold text-sm">Few courses</p>
                    <p className="text-sm">Select more courses for better chances to receive alerts</p>
                </div>
            </div>} */}

            <div className="flex space-x-2 justify-center mt-10 mb-4">
                <button
                    type="button"
                    className="inline-block px-10 py-4 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-[100%] mb-2"
                    onClick={() => {
                        handleCreateNewAlert(preferences)
                    }}
                >
                    Create Alert
                </button>
            </div>
            {addNewAlertError && (
                <p className="text-red-400 text-sm text-center">
                    {addNewAlertError}
                </p>
            )}
        </form>
    )

    return (
        <div className="flex justify-center" id="main">
            <div
                className="block rounded-lg shadow-lg bg-white"
                style={{ width: '90%', maxWidth: '540px', zIndex: '1' }}
            >
                <h5
                    className="text-gray-900 text-white text-xl leading-tight  mb-2 flex items-center content-center"
                    style={{
                        fontWeight: '300',
                        color: 'white',
                        padding: '20px',
                        borderTopRightRadius: '10px',
                        borderTopLeftRadius: '10px',
                        background: '#2563eb',
                    }}
                >
                    <IoTimeSharp style={{ marginRight: '12px' }} /> Create a Tee
                    Time Alert
                </h5>
                {isLoadingForGetCourses ? <LoadingAlertForm /> : alertForm}
            </div>
            <button
                ref={lowChanceModalRef}
                type="button"
                className="fixed"
                data-bs-toggle="modal"
                data-bs-target="#lowChanceModal"
            />
            <AlertSuggestionModal
                coursesInSelectedCity={coursesOptions}
                preferences={preferences}
                alertChance={alertChance}
                setAlertChance={setAlertChance}
                suggestionsToIncreaseAlertChance={
                    suggestionsToIncreaseAlertChance
                }
                setSuggestionsToIncreaseAlertChance={
                    setSuggestionsToIncreaseAlertChance
                }
                handleAddNewAlert={handleCreateNewAlert}
            />
            <CityWaitlistModal />
            <CourseWaitlistModal ShowNotification={ShowNotification} />
        </div>
    )
}

export default CreateTeeTimeAlertForm
