/* eslint-disable */

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { MdWarning, MdErrorOutline, MdInfoOutline } from 'react-icons/md'
import { RiAlarmWarningFill } from 'react-icons/ri'

import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import ReactApexChart from 'react-apexcharts'
import GetGolfersCountStats from '../utilities/GetGolfersCountStats'
import { auth } from '../firebase-config'
import { FaPauseCircle } from 'react-icons/fa'
import useAuth from '../hooks/useAuth'

import LoggedInOrNot from '../utilities/LoggedInOrNot'
import FetchGolferData from '../utilities/FetchGolferData'
// import TeeTimesHeatmap from '../components/dashboard-page/TeeTimesHeatmap'
import GetTrackingData from '../utilities/GetTrackingData'
import TotalGolfersCard from '../components/dashboard-page/TotalGolfersCard'
import GolfersWithRecentAlertsCard from '../components/dashboard-page/GolfersWithRecentAlertsCard'
import PayingGolfersCard from '../components/dashboard-page/PayingGolfersCard'
import ChurnedGolfersCard from '../components/dashboard-page/ChurnedGolfersCard'
import ActiveAlertsCard from '../components/dashboard-page/ActiveAlertsCard'
import PeriodsChart from '../components/dashboard-page/PeriodsChart'
import UsersWithMostRecentAlerts from '../components/dashboard-page/UsersWithMostRecentAlerts'
import PreferencesForEachCourseChart from '../components/dashboard-page/PreferencesForEachCourseChart'
import AlertsSentToUsersChart from '../components/dashboard-page/AlertsSentToUsersChart'
import AllUsersTable from '../components/dashboard-page/AllUsersTable'
import TopCompetitiveTeeTimesTable from '../components/dashboard-page/TopCompetitiveTeeTimesTable'
import NumberOfPlayersChart from '../components/dashboard-page/NumberOfPlayersChart'
import TeeTimesPerWeekdayChart from '../components/dashboard-page/TeeTimesPerWeekdayChart'
import GolfersPerCityChart from '../components/dashboard-page/GolfersPerCityChart'
import GetAllCourses from '../utilities/GetAllCourses'
import GetTimeAgo from '../utilities/GetTimeAgo'
import WaitlistTable from '../components/dashboard-page/WaitlistTable'
import PWAInstallCountCard from '../components/dashboard-page/PWAInstallCountCard'

const DashboardPage = () => {
    const navigate = useNavigate()

    const { token } = useAuth()

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(null)

    useEffect(() => {
        const HandleSession = async () => {
            setIsUserLoggedIn(await LoggedInOrNot())
        }
        HandleSession()
    }, [])

    if (!isUserLoggedIn) {
        navigate('/login')
    }

    const [golferUUID, setGolferUUID] = useState(null)
    const [golferData, setGolferData] = useState(null)
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setGolferUUID(currentUser.uid)
            }
        })
    }, [])

    useEffect(() => {
        if (!golferUUID) return
        const GetGolferData = async () => {
            const golferDataResponse = await FetchGolferData(golferUUID, token)
            setGolferData(golferDataResponse)
        }
        GetGolferData()
    }, [golferUUID])

    useEffect(() => {
        if (!golferData) return

        if (golferData?.admin === false) navigate('/')
    }, [golferData, navigate])

    const cities = [
        { city_name: 'san_diego', city_fullname: 'San Diego' },
        { city_name: 'los_angeles', city_fullname: 'Los Angeles' },
        { city_name: 'palm_desert', city_fullname: 'Palm Desert' },
        { city_name: 'san_francisco', city_fullname: 'San Francisco' },
        { city_name: 'orange_county', city_fullname: 'Orange County' },
        { city_name: 'denver', city_fullname: 'Denver' },
        { city_name: 'phoenix', city_fullname: 'Phoenix' },
        { city_name: 'scottsdale', city_fullname: 'Scottsdale' },
        { city_name: 'las_vegas', city_fullname: 'Las Vegas' },
        { city_name: 'san_jose', city_fullname: 'San Jose' },
        { city_name: 'santa_cruz', city_fullname: 'Santa Cruz' },
        { city_name: 'monterey', city_fullname: 'Monterey' },
        { city_name: 'santa_barbara', city_fullname: 'Santa Barbara' },
        { city_name: 'ventura', city_fullname: 'Ventura' },
        { city_name: 'thousand_oaks', city_fullname: 'Thousand Oaks' },
        { city_name: 'houston', city_fullname: 'Houston' },
        { city_name: 'boston', city_fullname: 'Boston' },
        { city_name: 'austin', city_fullname: 'Austin' },
        { city_name: 'san_antonio', city_fullname: 'San Antonio' },
        { city_name: 'dallas_fort_worth', city_fullname: 'Dallas/Fort Worth' },
        { city_name: 'chicago', city_fullname: 'Chicago' },
        { city_name: 'lake_tahoe', city_fullname: 'Lake Tahoe' },
        { city_name: 'miami', city_fullname: 'Miami' },
        { city_name: 'portland', city_fullname: 'Portland' },
        { city_name: 'palo_alto', city_fullname: 'Palo Alto' },
        { city_name: 'long_beach', city_fullname: 'Long Beach' },
        { city_name: 'seattle', city_fullname: 'Seattle' },
        { city_name: 'san_marcos', city_fullname: 'San Marcos' },
        { city_name: 'gilbert', city_fullname: 'Gilbert' },
        { city_name: 'kalispell', city_fullname: 'Kalispell' },
    ]

    const [coursesList, setCoursesList] = useState(null)
    const [flaggedCourses, setFlaggedCourses] = useState(null)
    const [idleCourses, setIdleCourses] = useState(null)
    const [groupedFlaggedCourses, setGroupedFlaggedCourses] = useState(null)
    const [reservationSystemsCourses, setReservationSystemsCourses] =
        useState(null)

    const aggregateCoursesByReservationSystem = (courses) => {
        const reservationSystems = {}

        courses.forEach((course) => {
            const system = course.course_reservation_system
            if (!reservationSystems[system]) {
                reservationSystems[system] = {
                    systemName: system,
                    totalCourses: 0,
                    flaggedCourses: 0,
                    flaggedPercentage: 0,
                }
            }
            reservationSystems[system].totalCourses += 1
            if (course.course_flagged) {
                reservationSystems[system].flaggedCourses += 1
            }
        })

        // Calculate the percentage of flagged courses
        Object.values(reservationSystems).forEach((system) => {
            if (system.totalCourses > 0) {
                system.flaggedPercentage =
                    (system.flaggedCourses / system.totalCourses) * 100
            }
        })

        return Object.values(reservationSystems)
    }

    const groupCoursesByScraperAndFlaggingReason = (courses) => {
        const groups = {}

        courses.forEach((course) => {
            // For courses with a shared scraper, create a group key
            const hasSharedScraper = course.shared_scraper_id != null
            const groupKey = hasSharedScraper
                ? `${course.shared_scraper_id}_${course.course_flagging_reason}`
                : `individual_${course.course_id}`

            if (!groups[groupKey]) {
                groups[groupKey] = []
            }

            groups[groupKey].push(course)
        })

        return Object.values(groups)
    }

    useEffect(() => {
        const HandleGetCoursesList = async () => {
            const coursesListResponse = await GetAllCourses()
            setCoursesList(coursesListResponse)

            // Filter the courses where course_flagged is true
            const flaggedCoursesList = coursesListResponse.filter(
                (course) => course.course_flagged === true
            )

            // Custom sorting function
            const sortOrder = {
                NO_SUCCESS_ALL_ERRORS: 0,
                NO_LOGS: 1,
                LOW_SUCCESS_RATE: 2,
            }

            flaggedCoursesList.sort((a, b) => {
                const reasonA = a.course_flagging_reason || '' // Handle undefined reasons
                const reasonB = b.course_flagging_reason || ''

                const orderA = sortOrder[reasonA] || 3 // Default to 3 for other reasons
                const orderB = sortOrder[reasonB] || 3

                if (orderA !== orderB) {
                    return orderA - orderB // Sort by reason first
                }

                // If reasons are the same, sort by newest course_flagged_timestamp
                const timestampA = a.course_flagged_timestamp
                    ? new Date(a.course_flagged_timestamp)
                    : new Date(0) // Fallback to epoch for undefined timestamps
                const timestampB = b.course_flagged_timestamp
                    ? new Date(b.course_flagged_timestamp)
                    : new Date(0)

                return timestampB - timestampA // Sort by newest timestamp
            })

            setFlaggedCourses(flaggedCoursesList)
            //idle courses are courses where course_scraper_idle is true
            const idleCoursesList = coursesListResponse.filter(
                (course) => course.course_scraper_idle === true
            )
            setIdleCourses(idleCoursesList)

            const groupedCourses =
                groupCoursesByScraperAndFlaggingReason(flaggedCoursesList)

            setGroupedFlaggedCourses(groupedCourses)

            const aggregatedData =
                aggregateCoursesByReservationSystem(coursesListResponse)
            setReservationSystemsCourses(aggregatedData)
        }

        HandleGetCoursesList()
    }, [])

    const [totalGolfersCount, setTotalGolfersCount] = useState(null)
    const [golfersWithRecentAlerts, setGolfersWithRecentAlerts] = useState(null)
    const [payingGolfersCount, setPayingGolfersCount] = useState(null)
    const [churnedGolfersCount, setChurnedGolfersCount] = useState(null)
    const [activeAlertsCount, setActiveAlertsCount] = useState(null)

    const [golfersCountStats, setGolfersCountStats] = useState(null)

    const [allCoursesTeeTimesOpenings, setAllCoursesTeeTimesOpenings] =
        useState(null)

    const [preferencesForEachCourse, setPreferencesForEachCourse] =
        useState(null)

    const [alertsSentToUsers, setAlertsSentToUsers] = useState(null)

    const [teeTimesNumberOfPlayers, setTeeTimesNumberOfPlayers] = useState(null)
    const [teeTimesWeekdays, setTeeTimesWeekdays] = useState(null)

    const [pwaInstallCount, setPwaInstallCount] = useState(null)

    const GetAllTrackingData = useCallback(async () => {
        const trackingKeys = [
            'coursesTeeTimesOpeningsTracking',
            'totalGolfersCountTracking',
            'golfersWithRecentAlertsTracking',
            'payingGolfersCountTracking',
            'churnedGolfersTracking',
            'activeAlertsCountTracking',
            'preferencesForEachCourseTracking',
            'alertsSentToUsersTracking',
            'teeTimesNumberOfPlayersTracking',
            'preferencesWeekdaysTracking',
            'pwaInstallCountTracking',
        ]

        const stateSetters = [
            setAllCoursesTeeTimesOpenings,
            setTotalGolfersCount,
            setGolfersWithRecentAlerts,
            setPayingGolfersCount,
            setChurnedGolfersCount,
            setActiveAlertsCount,
            setPreferencesForEachCourse,
            setAlertsSentToUsers,
            setTeeTimesNumberOfPlayers,
            setTeeTimesWeekdays,
            setPwaInstallCount,
        ]

        try {
            const trackingData = await Promise.all(
                trackingKeys.map((key) => GetTrackingData(key))
            )
            trackingData.forEach((data, index) => stateSetters[index](data))
        } catch (error) {
            console.error('Error fetching tracking data:', error)
        }
    }, [setTeeTimesNumberOfPlayers])

    useEffect(() => {
        GetAllTrackingData()
    }, [GetAllTrackingData])

    useEffect(() => {
        const HandleGetGolfersCountStats = async () => {
            const golferCountStatsResponse = await GetGolfersCountStats()
            setGolfersCountStats(golferCountStatsResponse)
        }
        HandleGetGolfersCountStats()
    }, [])
    const Analytics = () => (
        <div>
            {coursesList && (
                <div>
                    <div
                        className="flex flex-wrap justify-center  m-auto"
                        style={{ width: '90%', maxWidth: '2000px' }}
                    >
                        <div className="mx-10 my-2">
                            {' '}
                            <TotalGolfersCard
                                totalGolfersCount={totalGolfersCount}
                                color="#10b96b"
                            />
                        </div>
                        <div className="mx-10 my-2">
                            {' '}
                            <GolfersWithRecentAlertsCard
                                golfersWithRecentAlerts={
                                    golfersWithRecentAlerts
                                }
                                color="#7239EA"
                            />
                        </div>
                        <div className="mx-10 my-2">
                            {' '}
                            <PayingGolfersCard
                                payingGolfersCount={payingGolfersCount}
                                golferSubscriptionTypeCounts={
                                    golfersCountStats?.subscriptionTypeCounts
                                }
                                color="#ffa623"
                            />
                        </div>
                        <div className="mx-10 my-2">
                            {' '}
                            <ChurnedGolfersCard
                                churnedGolfersCount={churnedGolfersCount}
                                golfersSubscriptionStatusCount={
                                    golfersCountStats?.subscriptionStatusCounts
                                }
                                color="#F1416C"
                            />
                        </div>
                        <div className="mx-10 my-2">
                            {' '}
                            <ActiveAlertsCard
                                activeAlertsCount={activeAlertsCount}
                                color="#2fb0eb"
                            />
                        </div>
                        <div className="mx-10 my-2">
                            {' '}
                            <PWAInstallCountCard
                                pwaInstallCount={pwaInstallCount}
                                color="#1043b9"
                            />
                        </div>
                    </div>

                    <GolfersPerCityChart />

                    {/* <TeeTimesHeatmap
                        allCoursesTeeTimesOpenings={allCoursesTeeTimesOpenings}
                        coursesList={coursesList}
                        cities={cities}
                    /> */}
                    <PeriodsChart
                        allCoursesTeeTimesOpenings={allCoursesTeeTimesOpenings}
                        coursesList={coursesList}
                    />
                    <NumberOfPlayersChart
                        teeTimesNumberOfPlayers={teeTimesNumberOfPlayers}
                    />
                    <TeeTimesPerWeekdayChart
                        teeTimesWeekdays={teeTimesWeekdays}
                    />
                    <PreferencesForEachCourseChart
                        preferencesForEachCourse={preferencesForEachCourse}
                        coursesList={coursesList}
                        cities={cities}
                    />

                    <AlertsSentToUsersChart
                        alertsSentToUsers={alertsSentToUsers}
                        coursesList={coursesList}
                        cities={cities}
                    />

                    <UsersWithMostRecentAlerts />
                    <AllUsersTable />
                    <TopCompetitiveTeeTimesTable />

                    {/* <WaitlistTable type="city" title="New Cities Waitlist" /> */}
                    <WaitlistTable type="course" title="New Courses Waitlist" />
                </div>
            )}
        </div>
    )

    const MessagesTracker = () => {
        const [displayedMessages, setDisplayedMessages] = useState([])
        const [freshMessages, setFreshMessages] = useState([])
        const newestMessageIdRef = useRef(null)
        const [selectedMessageNames, setSelectedMessageNames] = useState(
            new Set()
        )
        const [page, setPage] = useState(1)
        const limit = 10
        const [reachedEnd, setReachedEnd] = useState(false)
        const rowsPerPage = 20
        const fetchSentMessages = async (
            pageNumber,
            limitCount,
            messageNames
        ) => {
            try {
                const token = localStorage.getItem('jwt')
                    ? localStorage.getItem('jwt')
                    : ''
                const response = await fetch(
                    `${global.SERVER_HOST}/api/messaging_log?page=${pageNumber}&limit=${limitCount}&message_names=${messageNames}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const jsonData = await response.json()
                setDisplayedMessages(jsonData)
                if (jsonData[0]?.id && newestMessageIdRef.current === null) {
                    newestMessageIdRef.current = jsonData[0].id
                }
                if (jsonData.length < limitCount) {
                    setReachedEnd(true)
                }
            } catch (err) {
                console.error(err)
            }
        }

        const fetchFreshSentMessages = async (
            pageNumber,
            limitCount,
            messageNames
        ) => {
            try {
                if (newestMessageIdRef.current === null) {
                    console.log(
                        'not fetching fresh messages because newestMessageId is not truthy'
                    )
                    return
                }
                const token = localStorage.getItem('jwt')
                    ? localStorage.getItem('jwt')
                    : ''
                const response = await fetch(
                    `${global.SERVER_HOST}/api/messaging_log?page=${pageNumber}&limit=${limitCount}&message_names=${messageNames}&latest_id=${newestMessageIdRef.current}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const jsonData = await response.json()
                setFreshMessages((prevMessages) => [
                    ...prevMessages,
                    ...jsonData,
                ])
                if (jsonData[0]?.id) {
                    newestMessageIdRef.current = jsonData[0].id
                }
                if (jsonData.length < limitCount) {
                    setReachedEnd(true)
                }
            } catch (err) {
                console.error(err)
            }
        }

        useEffect(() => {
            // convert selectedMessageNames to array then join with ','

            fetchSentMessages(1, limit, [...selectedMessageNames].join(','))
        }, [selectedMessageNames])

        useEffect(() => {
            const interval = setInterval(() => {
                fetchFreshSentMessages(
                    1,
                    limit,
                    [...selectedMessageNames].join(',')
                )
            }, 5000)
            return () => clearInterval(interval)
        }, [selectedMessageNames])

        useEffect(() => {
            const messageNames = [...selectedMessageNames].join(',')
            fetchSentMessages(page, limit, messageNames)
        }, [page, limit, selectedMessageNames])

        useEffect(() => {
            // go to next page messages
        }, [page])

        const [animatedMessages, setAnimatedMessages] = useState(new Set())

        // inside handleNewMessagesClick
        const handleNewMessagesClick = async () => {
            // Go back to page 1
            setPage(1)

            // Fetch fresh messages
            const freshMessageNames = [...selectedMessageNames].join(',')
            await fetchFreshSentMessages(1, limit, freshMessageNames)

            // Add new fresh messages to animatedMessages list
            const newAnimatedMessages = new Set(
                freshMessages.map((message) => message.id)
            )
            setAnimatedMessages(newAnimatedMessages)

            // Move fresh messages to displayedMessages
            setDisplayedMessages((prevMessages) => [
                ...freshMessages,
                ...prevMessages.slice(0, limit - freshMessages.length),
            ])
            setFreshMessages([])

            // If there are fresh messages, update newestMessageIdRef
            if (freshMessages.length > 0 && freshMessages[0]?.id) {
                newestMessageIdRef.current = freshMessages[0].id
            }
        }

        useEffect(() => {
            // After each render, clear animated messages
            setAnimatedMessages(new Set())
        }, [displayedMessages])

        const messagesNames = [
            {
                name: 'free_trial_end',
            },
            {
                name: 'free_trial_3_days',
            },
            {
                name: 'free_trial_7_days',
            },
            {
                name: 'post_trial_1_day',
            },
            {
                name: 'post_trial_3_days',
            },
            {
                name: 'post_trial_1_week',
            },
            {
                name: 'post_trial_2_weeks',
            },
            {
                name: 'post_trial_4_weeks',
            },
            {
                name: 'post_trial_6_weeks',
            },
            {
                name: 'alert',
            },
            {
                name: 'welcome',
            },
        ]
        const [visible, setVisible] = useState({})

        return (
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
                    All Messages
                    <button
                        type="button"
                        onClick={handleNewMessagesClick}
                        className={`ml-6 inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out ${
                            freshMessages?.length === 0 && 'bg-slate-300 '
                        }`}
                        style={{
                            pointerEvents:
                                freshMessages?.length === 0 && 'none',
                        }}
                    >
                        {freshMessages?.length} New messages
                    </button>
                </h1>

                <div className="flex items-center mb-4 justify-start ml-4">
                    <div className="flex justify-center">
                        <div
                            className="relative"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <button
                                type="button"
                                id="dropdownMenuButton2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{
                                    paddingInline: '12px',
                                    paddingBlock: '7px',
                                }}
                                className="dropdown-toggle inline-block text-sm rounded-md bg-gray-800 transition ease-in-out border border-gray-700 focus:border-blue-600 focus:outline-none flex items-center whitespace-nowrap text-gray-200 py-1"
                            >
                                Filters
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="caret-down"
                                    className="w-2 ml-2"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                                    />
                                </svg>
                            </button>
                            <ul
                                className="dropdown-menu min-w-max absolute hidden text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-gray-800"
                                aria-labelledby="dropdownMenuButton2"
                            >
                                <h1>
                                    <span className="text-sm py-2 px-4 font-bold block w-full whitespace-nowrap bg-gray-700 text-white">
                                        Message Name
                                    </span>
                                </h1>

                                {messagesNames.map((message, index) => {
                                    const selected = selectedMessageNames.has(
                                        message.name
                                    )
                                    return (
                                        <li key={index}>
                                            <label className="dropdown-item text-sm py-2 px-4 font-normal block w-full   text-gray-300 bg-gray-700  text-white focus:text-white focus:bg-gray-700 hover:bg-blue-600">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => {
                                                        if (selected) {
                                                            selectedMessageNames.delete(
                                                                message.name
                                                            )
                                                        } else {
                                                            selectedMessageNames.add(
                                                                message.name
                                                            )
                                                        }
                                                        setSelectedMessageNames(
                                                            new Set(
                                                                selectedMessageNames
                                                            )
                                                        )
                                                    }}
                                                />{' '}
                                                {message.name}
                                            </label>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                {!displayedMessages && (
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

                {displayedMessages && (
                    <div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg pb-8">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Message ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sent Via
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Message Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Message Body
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Golfer Fullname
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Golfer Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Golfer Phone
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Message Category
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Sent At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedMessages.map((message, i) => (
                                        <tr
                                            key={i}
                                            className={`bg-white border-b dark:bg-gray-900 dark:border-gray-700 ${
                                                animatedMessages.has(message.id)
                                                    ? 'slide-down'
                                                    : ''
                                            }`}
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {message?.id}
                                            </th>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {message?.sent_via}
                                            </th>
                                            <td className="px-6 py-4">
                                                {message?.message_name}
                                            </td>
                                            <td
                                                className="px-6 py-4"
                                                style={{ width: '400px' }}
                                            >
                                                <div
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                    }}
                                                >
                                                    {visible[message.id] ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: message?.message_body,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: `${message?.message_body?.substring(
                                                                    0,
                                                                    60
                                                                )}...`,
                                                            }}
                                                        />
                                                    )}
                                                    {message?.message_body
                                                        ?.length > 60 && (
                                                        <button
                                                            onClick={() =>
                                                                setVisible({
                                                                    ...visible,
                                                                    [message.id]:
                                                                        !visible[
                                                                            message
                                                                                .id
                                                                        ],
                                                                })
                                                            }
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            {visible[message.id]
                                                                ? 'See Less'
                                                                : 'See More'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {`${message?.golfer_first_name} ${message?.golfer_last_name}` ||
                                                    'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {message?.golfer_email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {message?.golfer_phone || 'N/A'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {message?.message_category}
                                            </td>

                                            <td className="px-6 py-4">
                                                {new Date(
                                                    message?.sent_at
                                                ).toLocaleString()}{' '}
                                                <span className="text-xs italic">
                                                    (
                                                    {GetTimeAgo(
                                                        new Date(
                                                            message?.sent_at
                                                        )
                                                    )}
                                                    )
                                                </span>
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
                                            displayedMessages?.length || 1}
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
                )}
            </div>
        )
    }

    const ScrapingLogs = () => {
        const [selectedCity, setSelectedCity] = useState('san_diego')

        const [coursesDisplayList, setCoursesDisplayList] = useState(null)
        const [selectedCourseId, setSelectedCourseId] = useState(null)

        const [scrapingLogs, setScrapingLogs] = useState(null)

        useEffect(() => {
            if (!coursesList) return
            const coursesDispList = coursesList.filter(
                (course) => course.course_city === selectedCity
            )

            setCoursesDisplayList(coursesDispList)
        }, [selectedCity])

        const [page, setPage] = useState(1)
        const limit = 10
        const [reachedEnd, setReachedEnd] = useState(false)
        const rowsPerPage = 20

        const [averages, setAverages] = useState(null)
        const [openedTeeTimesInTimeranges, setOpenedTeeTimesInTimeranges] =
            useState(null)
        const [scrapingLogsResponse, setScrapingLogsResponse] = useState(null)

        const fetchScrapingLogs = useCallback(async () => {
            try {
                const token = localStorage.getItem('jwt')
                    ? localStorage.getItem('jwt')
                    : ''
                const response = await fetch(
                    `${global.SERVER_HOST}/api/scraping_log/course_id/${selectedCourseId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ page, limit }), // send page and limit as body
                    }
                )
                const jsonData = await response.json()
                setScrapingLogsResponse(jsonData)

                setScrapingLogs((prevLogs) => [
                    ...prevLogs,
                    ...jsonData.allLogs,
                ]) // append new logs
                setAverages({
                    averageDailyOpeningsForThePastMonth: Number(
                        jsonData.averageDailyOpeningsForThePastMonth
                    )?.toFixed(
                        Number(jsonData.averageDailyOpeningsForThePastMonth) < 1
                            ? 1
                            : 0
                    ),
                    averageDailyOpeningsForThePastWeek: Number(
                        jsonData.averageDailyOpeningsForThePastWeek
                    )?.toFixed(
                        Number(jsonData.averageDailyOpeningsForThePastWeek) < 1
                            ? 1
                            : 0
                    ),
                })

                if (jsonData.length < limit) setReachedEnd(true) // if less than limit logs are returned, we've reached the end
            } catch (err) {
                console.error(err.message)
            }
        }, [
            selectedCourseId,
            page,
            limit,
            setScrapingLogs,
            setAverages,
            setReachedEnd,
        ])

        useEffect(() => {
            if (!selectedCourseId) return
            setScrapingLogs([]) // reset logs when course id changes
            setReachedEnd(false) // reset reached end when course id changes
            setPage(1) // reset page when course id changes
        }, [selectedCourseId])

        useEffect(() => {
            if (!selectedCourseId) return
            fetchScrapingLogs() // fetch logs when page changes, but not when page is reset to 1
        }, [page, fetchScrapingLogs, selectedCourseId])

        const handleNextPage = () => {
            if (reachedEnd) return // do nothing if we've reached the end
            setPage(page + 1)
        }

        const [selectedTimeUnit, setSelectedTimeUnit] = useState('week')

        useEffect(() => {
            if (!scrapingLogsResponse?.periods) return
            if (selectedTimeUnit === 'week') {
                setOpenedTeeTimesInTimeranges(
                    scrapingLogsResponse.periods.last7Days
                )
            } else if (selectedTimeUnit === 'month') {
                setOpenedTeeTimesInTimeranges(
                    scrapingLogsResponse.periods.last30Days
                )
            }
        }, [selectedCourseId, selectedTimeUnit, scrapingLogsResponse])

        const [chartData, setChartData] = useState(null)

        useEffect(() => {
            if (!openedTeeTimesInTimeranges) return

            const categories = Object.keys(openedTeeTimesInTimeranges)
            const totalPeriods = Object.values(
                openedTeeTimesInTimeranges
            ).reduce((a, b) => a + parseFloat(b) || 0, 0)

            setChartData({
                series: categories.map((period) => ({
                    name: period,
                    data: [
                        (openedTeeTimesInTimeranges[period] / totalPeriods) *
                            100 || 0,
                    ],
                })),
                options: {
                    chart: {
                        fontFamily: 'Urbanist',
                        type: 'bar',
                        stacked: true,
                        stackType: '100%',
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    stroke: {
                        width: 1,
                        colors: ['#fff'],
                    },
                    xaxis: {
                        categories: ['Tee Times by Period'],
                        show: false,
                        labels: {
                            show: false,
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                    },
                    tooltip: {
                        y: {
                            formatter(val, opts) {
                                const index = opts.seriesIndex
                                const period = categories[index]
                                return `${openedTeeTimesInTimeranges[period]} Tee Times`
                            },
                        },
                    },
                    fill: {
                        opacity: 1,
                        colors: [
                            '#2E93E8',
                            '#00e396',
                            '#FFC107',
                            '#ff4560',
                            '#2faf20',
                            '#9C27B0',
                            '#af7620',
                        ],
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'left',
                        offsetX: 40,
                        markers: {
                            fillColors: [
                                '#2E93E8',
                                '#00e396',
                                '#FFC107',
                                '#ff4560',
                                '#2faf20',
                                '#9C27B0',
                                '#af7620',
                            ],
                        },
                    },
                },
            })
        }, [openedTeeTimesInTimeranges, selectedCourseId])

        return (
            <div
                id="chart"
                className="block py-6 pb-0 rounded-xl shadow-sm bg-white mx-auto my-8"
                style={{
                    width: '90%',
                    maxWidth: '1600px',
                    margin: 'auto',
                    marginBlock: '64px',
                    paddingBottom: '50%',
                }}
            >
                <h1 className="text-2xl font-medium text-slate-500 p-6">
                    Scraping Logs
                </h1>

                <div className="mb-3  flex">
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="form-select appearance-none mx-2 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        aria-label="Default select example"
                        style={{ width: '90%', maxWidth: '200px' }}
                    >
                        <option value="">Select a city</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city.city_name}>
                                {city.city_fullname}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="form-select appearance-none mx-2 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        aria-label="Default select example"
                        style={{ width: '90%', maxWidth: '400px' }}
                    >
                        <option value="">Select a course</option>
                        {coursesDisplayList?.map((course, index) => (
                            <option key={index} value={course.course_id}>
                                {course.course_fullname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex  ">
                    <div>
                        <div
                            className="block py-6 pb-0 rounded-xl shadow-md bg-white  m-8 mt-16"
                            style={{
                                maxWidth: '320px',
                                height: 'fit-content',
                                padding: '1rem',
                            }}
                        >
                            <div>
                                <p>
                                    <div
                                        className="text-slate-800"
                                        style={{
                                            fontSize: '1.875rem',
                                            fontHeight: '2.25rem',
                                            fontWeight: '700',
                                        }}
                                    >
                                        {averages?.averageDailyOpeningsForThePastWeek ||
                                            0}
                                    </div>
                                    <span
                                        className=" text-slate-400 text-sm -mt-1 	 "
                                        style={{
                                            marginBlock: '7px',
                                            fontSize: '1rem',
                                            lineHeight: '1.5rem',
                                            color: '#6b7280',
                                            fontWeight: '400',
                                        }}
                                    >
                                        Average daily openings for the last 7
                                        days{' '}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className="block py-4 pb-0 rounded-xl shadow-md bg-white  m-8 mt-16"
                            style={{
                                maxWidth: '320px',
                                height: 'fit-content',
                                padding: '1rem',
                                width: '100%',
                            }}
                        >
                            <div>
                                <p>
                                    <div
                                        className="text-slate-800"
                                        style={{
                                            fontSize: '1.875rem',
                                            fontHeight: '2.25rem',
                                            fontWeight: '700',
                                        }}
                                    >
                                        {averages?.averageDailyOpeningsForThePastMonth ||
                                            0}
                                    </div>
                                    <span
                                        className=" text-slate-400 text-sm -mt-1 	 "
                                        style={{
                                            marginBlock: '7px',
                                            fontSize: '1rem',
                                            lineHeight: '1.5rem',
                                            color: '#6b7280',
                                            fontWeight: '400',
                                        }}
                                    >
                                        Average daily openings for the last 30
                                        days{' '}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {chartData && (
                    <div
                        id="chart"
                        className="block  rounded-xl shadow-md bg-white mx-auto  "
                        style={{
                            maxWidth: '1600px',
                            margin: '2rem',
                            marginBottom: '4rem',
                            paddingBottom: '10px',
                        }}
                    >
                        <h1 className="text-base font-medium text-slate-500 p-6">
                            Opened Tee Times by Day Periods in the last
                            <select
                                id="city-select"
                                className="  block w-full px-3 py-1.5 text-gray-600 font-semibold text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500 w-fit inline-block "
                                aria-label="Default select example"
                                value={selectedTimeUnit}
                                onChange={(e) => {
                                    setSelectedTimeUnit(e.target.value)
                                }}
                            >
                                <option value="week"> 7 days </option>
                                <option value="month"> 30 days </option>
                            </select>
                        </h1>

                        <div className="px-8">
                            <ReactApexChart
                                options={chartData.options}
                                series={chartData.series}
                                type="bar"
                                height={100}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg pb-8 mx-8">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {/* <th scope="col" className="px-6 py-3">
                                            Log ID
                                        </th> */}
                                    <th scope="col" className="px-6 py-3">
                                        Datetime
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        All Available Tee Times
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Opened Tee Times
                                    </th>

                                    {/* <th scope="col" className="px-6 py-3">
                                            Scraping Duration
                                        </th> */}
                                </tr>
                            </thead>
                            {scrapingLogs?.length > 0 && (
                                <tbody>
                                    {scrapingLogs.map((log, i) => (
                                        <tr
                                            key={i}
                                            className={`bg-white border-b dark:bg-gray-900 dark:border-gray-700 slide-down
                                            `}
                                        >
                                            {/* <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {log?.id}
                                            </th> */}
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {new Date(
                                                    log?.date
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </th>

                                            <td className="px-6 py-4">
                                                {
                                                    log?.unique_all_available_teetimes_count
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-green-600 font-semibold">
                                                {log?.opened_teetimes_count}
                                            </td>

                                            {/* <td className="px-6 py-4">
                                                {log?.scraping_duration_in_minutes} <italic className="text-xs">minutes</italic>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            )}
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
                                        scrapingLogs?.length || 1}
                                </span>
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className={clsx(
                                        'inline-flex items-center px-4 py-2 text-sm font-medium text-white border-0 border-l border-gray-700 rounded-r dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                                        reachedEnd
                                            ? 'bg-gray-400 hover:bg-gray-500 pointer-events-none'
                                            : 'bg-gray-800 hover:bg-gray-900'
                                    )}
                                    onClick={handleNextPage}
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
        )
    }
    const BrokenCourseAlert = ({
        courses,
        icon,
        bgColor,
        borderColor,
        textColor,
        title,
        message,
    }) => (
        <div
            className={`flex items-center justify-start p-4 mx-auto ${textColor} ${bgColor} ${borderColor} border-l-4 rounded-lg shadow`}
        >
            <div
                className="mb-4 flex items-center"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '70px',
                    height: '55px',
                    justifyContent: 'space-around',
                    margin: 0,
                }}
            >
                {icon}
                <span className="font-semibold text-xs">{title}</span>
            </div>
            <div className="ml-12">
                {courses.map((course, index) => {
                    // const flaggedTimestamp = course?.course_flagged_timestamp
                    //if title is "Idle" then use course_idle_scraper_last_run_timestamp for timestamp
                    const flaggedTimestamp =
                        title === 'Idle'
                            ? course?.course_idle_scraper_last_run_timestamp
                            : course?.course_flagged_timestamp
                    const timeAgo = flaggedTimestamp
                        ? GetTimeAgo(new Date(flaggedTimestamp))
                        : 'N/A'

                    return (
                        <div key={index} className={'flex-grow '}>
                            <div className="font-bold">
                                {course?.course_fullname} (
                                {course?.course_reservation_system
                                    ?.replace(/_/g, ' ')
                                    .toUpperCase() || 'UNSPECIFIED'}
                                )
                            </div>
                            <div className="mb-2">
                                {message}
                                {flaggedTimestamp && (
                                    <span
                                        style={{
                                            fontSize: '0.8rem',
                                            color: '#6c757d',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        <i
                                            className="fas fa-clock"
                                            aria-hidden="true"
                                        />{' '}
                                        since {timeAgo}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const CoursesIssues = () => (
        <div>
            <div
                className="block py-6 pb-0 rounded-xl shadow-sm bg-white mx-auto my-8"
                style={{
                    width: '90%',
                    maxWidth: '1600px',
                    margin: 'auto',
                    marginBlock: '64px',
                    paddingBottom: '10px',
                }}
            >
                {reservationSystemsCourses && (
                    <div className="  p-6  space-y-2 ">
                        {reservationSystemsCourses.map((system, index) => (
                            <div key={index}>
                                {system.flaggedPercentage > 50 && (
                                    <div
                                        id="alert-border-2"
                                        className="flex items-center p-3  text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-800 dark:border-red-800"
                                        role="alert"
                                    >
                                        <RiAlarmWarningFill />

                                        <div className="ms-3 ml-4 text-sm font-medium">
                                            {system.flaggedPercentage?.toFixed(
                                                0
                                            )}
                                            % of courses in reservation system{' '}
                                            <b>{system?.systemName}</b> are
                                            having issues
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <h1 className="text-2xl font-medium text-slate-500 p-6">
                    Courses Issues{' '}
                    {`(${flaggedCourses?.length}/${coursesList?.length} courses with issues)`}
                </h1>

                {/* Notification Items */}

                {groupedFlaggedCourses && (
                    <div className="space-y-4 p-6 rounded-xl">
                        {Object.entries(groupedFlaggedCourses).map(
                            ([key, courses], i) => (
                                <div key={i}>
                                    {courses[0]?.course_flagging_reason ===
                                        'NO_LOGS' && (
                                        <BrokenCourseAlert
                                            courses={courses}
                                            icon={<MdWarning size="24" />}
                                            bgColor="bg-rose-50"
                                            borderColor="border-rose-800"
                                            textColor="text-rose-800"
                                            title="Scraper"
                                            message="No recent activity detected, Scraper is most likely not working."
                                        />
                                    )}

                                    {courses[0]?.course_flagging_reason ===
                                        'LOW_SUCCESS_RATE' && (
                                        <BrokenCourseAlert
                                            courses={courses}
                                            icon={<MdErrorOutline size="24" />}
                                            bgColor="bg-pink-50"
                                            borderColor="border-pink-800"
                                            textColor="text-pink-800"
                                            title="Performance"
                                            message={`High error rate detected in recent scrapes. ${
                                                courses[0]
                                                    ?.course_flag_extra_info
                                                    ? `(${courses[0]?.course_flag_extra_info}% error rate)`
                                                    : ''
                                            }`}
                                        />
                                    )}

                                    {courses[0]?.course_flagging_reason ===
                                        'NO_TEE_TIMES' && (
                                        <BrokenCourseAlert
                                            courses={courses}
                                            icon={<MdInfoOutline size="24" />}
                                            bgColor="bg-sky-50"
                                            borderColor="border-sky-800"
                                            textColor="text-sky-800"
                                            title="Data"
                                            message="No tee times are being found."
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            <div
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
                    Courses with idle scrapers{' '}
                    {`(${idleCourses?.length}/${coursesList?.length} courses with no alerts set up for them )`}
                </h1>
                {idleCourses && (
                    <div className="space-y-4 p-6 rounded-xl">
                        {idleCourses.map((course, index2) => (
                            <BrokenCourseAlert
                                key={index2}
                                courses={[course]}
                                icon={<FaPauseCircle size="24" />}
                                bgColor="bg-gray-50"
                                borderColor="border-gray-800"
                                textColor="text-gray-800"
                                title="Idle"
                                message="No alerts set up for this course so the scraper is intentionally idle."
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

    const [selectedTab, setSelectedTab] = useState(1)

    const tabs = [
        { id: 1, name: 'Analytics', component: <Analytics /> },
        { id: 2, name: 'Email/SMS Tracker', component: <MessagesTracker /> },
        { id: 3, name: 'Scraping Logs', component: <ScrapingLogs /> },
        { id: 4, name: 'Courses Issues', component: <CoursesIssues /> },
    ]

    if (!golferData) {
        return null
    }

    return (
        <div style={{ paddingBottom: '200px' }}>
            <div className=" w-fit m-auto mb-16 mt-8">
                <ul
                    className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4"
                    id="tabs-tab"
                    role="tablist"
                >
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer "
                        >
                            <a
                                className={`nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent  ${
                                    selectedTab === tab.id && ' active'
                                } `}
                                onClick={() => setSelectedTab(tab.id)}
                                data-toggle="tab"
                                role="tablist"
                            >
                                {tab.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedTab === 1 && <Analytics />}
            {selectedTab === 2 && <MessagesTracker />}
            {selectedTab === 3 && <ScrapingLogs />}
            {selectedTab === 4 && <CoursesIssues />}
        </div>
    )
}

export default DashboardPage
