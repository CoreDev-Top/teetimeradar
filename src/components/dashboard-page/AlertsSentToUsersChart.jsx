import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import clsx from 'clsx'

const ranges = [
    { name: 'Today', id: 0 },
    { name: 'Last Week', id: 1 },
    { name: 'Last Month', id: 2 },
    { name: 'Last Year', id: 3 },
    { name: 'All Time', id: 4 },
]

const AlertsSentToUsersChart = ({ alertsSentToUsers, coursesList, cities }) => {
    const [selectedCity, setSelectedCity] = useState(cities[0]?.city_name)
    const [coursesInSelectedCity, setCoursesInSelectedCity] = useState(null)

    useEffect(() => {
        if (!selectedCity) return
        setCoursesInSelectedCity(
            coursesList.filter((course) => course.course_city === selectedCity)
        )
    }, [coursesList, selectedCity])

    const [selectedRange, setSelectedRange] = useState(0)

    const HandleChangingRange = (range) => {
        setSelectedRange(range.id)
    }

    const [alertsSentToUsersInRange, setAlertsSentToUsersInRange] =
        useState(null)

    useEffect(() => {
        if (!alertsSentToUsers) return

        const GetRangeStart = (rangeId) => {
            const today = new Date()
            // today should be in PST timezone

            switch (rangeId) {
                case 0:
                    return new Date().setHours(0, 0, 0, 0)
                case 1:
                    return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                case 2:
                    return new Date(today.setMonth(today.getMonth() - 1))
                case 3:
                    return new Date(today.setFullYear(today.getFullYear() - 1))
                case 4:
                    return new Date(-8640000000000000)
                default:
                    return new Date().setHours(0, 0, 0, 0)
            }
        }

        const rangeStart = GetRangeStart(selectedRange)

        const filteredAlertsSentToUsers = Object.entries(alertsSentToUsers)
            .filter(([date]) => new Date(date) >= rangeStart)
            .reduce((obj, [date, value]) => ({ ...obj, [date]: value }), {})

        const aggregatedAlerts = Object.values(
            filteredAlertsSentToUsers
        ).reduce((acc, alerts) => {
            Object.entries(alerts).forEach(([course, alertsByCourse]) => {
                const totalAlerts = Object.values(alertsByCourse).reduce(
                    (a, b) => a + b,
                    0
                )
                acc[course] = (acc[course] || 0) + totalAlerts
            })
            return acc
        }, {})

        setAlertsSentToUsersInRange(aggregatedAlerts)
    }, [selectedRange, alertsSentToUsers])

    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        if (!alertsSentToUsersInRange) return

        setChartData({
            isLoaded: true,

            series: [
                {
                    name: 'Alerts Sent',

                    data: coursesInSelectedCity.map(
                        (course) =>
                            alertsSentToUsersInRange?.[course?.course_name] ||
                            0.005
                    ),
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    fontFamily: 'Urbanist',
                },
                colors: ['#6610f2'],

                plotOptions: {
                    bar: {
                        borderRadius: 2,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                        columnWidth: '40%',
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter(val) {
                        return val?.toFixed(0)
                    },
                    offsetY: 10,
                    style: {
                        fontSize: '12px',
                        colors: ['white'],
                    },
                },

                xaxis: {
                    categories: coursesInSelectedCity.map(
                        (course) => course?.course_fullname
                    ),
                    position: 'bottom',
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                yaxis: {
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter(val) {
                            return val?.toFixed(0)
                        },
                    },
                },
                title: {
                    floating: true,
                    offsetY: 330,
                    align: 'center',
                    style: {
                        color: '#444',
                    },
                },
            },
        })
    }, [alertsSentToUsersInRange, selectedCity, coursesInSelectedCity])

    return (
        <div>
            {/* <button onClick={()=>{forceUpdate()}} > RERENDER </button> */}
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
                    Alerts Sent to Users for each Course in
                    <select
                        id="city-select"
                        className="  block w-full px-3 py-1.5 text-gray-600 font-semibold text-gray-900 bg-white bg-clip-padding cursor-pointer outline-none caret-pink-500 w-fit inline-block "
                        aria-label="Default select example"
                        value={selectedCity}
                        onChange={(e) => {
                            setSelectedCity(e.target.value)
                        }}
                    >
                        {cities.map((city, index) => (
                            <option key={index} value={city.city_name}>
                                {city.city_fullname}
                            </option>
                        ))}
                    </select>
                </h1>

                {!alertsSentToUsers && (
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

                {alertsSentToUsers && (
                    <div>
                        <div className="flex items-center px-6 mb-12">
                            <div
                                className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
                                role="group"
                            >
                                {ranges.map((range, i) => (
                                    <div key={i}>
                                        <a
                                            onClick={() =>
                                                HandleChangingRange(range)
                                            }
                                            className={clsx(
                                                i === 0 && 'rounded-l ',
                                                i + 1 === ranges.length &&
                                                    'rounded-r',
                                                ' px-6 py-1 cursor-pointer bg-slate-500 text-white  text-xs leading-tight uppercase hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-0 active:bg-slate-700 transition duration-150 ease-in-out',
                                                selectedRange === range.id &&
                                                    'bg-slate-800'
                                            )}
                                        >
                                            {range.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-8">
                            {chartData && alertsSentToUsersInRange && (
                                <ReactApexChart
                                    options={chartData.options}
                                    series={chartData.series}
                                    type="bar"
                                    height={350}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlertsSentToUsersChart
