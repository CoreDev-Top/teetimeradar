import React, { useEffect, useState, useMemo, useCallback } from 'react'
import ReactApexChart from 'react-apexcharts'
import clsx from 'clsx'

const periods = ['5am-9am', '9am-12pm', '12pm-3pm', '3pm-After']

function CalculateAlertsByTime(allCoursesTeeTimesOpenings) {
    if (!allCoursesTeeTimesOpenings) return [{}]
    return Object.values(allCoursesTeeTimesOpenings).reduce((acc, val) => {
        Object.entries(val).forEach(([course, alerts]) => {
            Object.keys(alerts).forEach((hour) => {
                const time =
                    parseInt(hour, 10) < 5
                        ? '5am-9am'
                        : parseInt(hour, 10) < 9
                        ? '5am-9am'
                        : parseInt(hour, 10) < 12
                        ? '9am-12pm'
                        : parseInt(hour, 10) < 15
                        ? '12pm-3pm'
                        : '3pm-After'
                acc[time] = acc[time] || {}
                acc[time][course] = acc[time][course] || 0
                acc[time][course] += alerts[hour]
            })
        })
        return acc
    }, {})
}

const PeriodsChart = ({ allCoursesTeeTimesOpenings, coursesList }) => {
    // get how many alerts for each courses between
    const alertsByTime = useMemo(
        () => CalculateAlertsByTime(allCoursesTeeTimesOpenings),
        [allCoursesTeeTimesOpenings]
    )

    const [chartData, setChartData] = useState(null)

    const options = [
        { id: 1, name: 'Average' },
        { id: 2, name: 'Seperate Courses' },
    ]
    const [selectedOption, setSelectedOption] = useState(options[0])

    const MapCoursesToAlertCount = useCallback(
        (time, allCourses) => {
            if (allCourses) {
                const totalAlerts = coursesList.reduce(
                    (total, course) =>
                        total +
                        (alertsByTime?.[time]?.[course?.course_name] || 0),
                    0
                )
                return [totalAlerts / coursesList.length]
            }

            return coursesList.map(
                (course) => alertsByTime?.[time]?.[course?.course_name] || 0
            )
        },
        [alertsByTime, coursesList]
    )

    useEffect(() => {
        if (!alertsByTime || !coursesList) return

        const allCourses = selectedOption.id === 1

        setChartData({
            series: periods.map((period) => ({
                name: period,
                data: MapCoursesToAlertCount(period, allCourses),
            })),
            options: {
                chart: {
                    fontFamily: 'Urbanist',
                    type: 'bar',
                    // height: 350,

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
                title: {
                    // text: '100% Stacked Bar'
                },
                xaxis: {
                    categories: allCourses
                        ? ['Average of All Courses']
                        : coursesList.map((course) => course?.course_fullname),
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
                        formatter(val) {
                            return `${Number(val)?.toFixed(0)} Alerts`
                        },
                    },
                },
                fill: {
                    opacity: 1,
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40,
                },
            },
        })
    }, [MapCoursesToAlertCount, alertsByTime, coursesList, selectedOption])

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
                    Tee Times Opening Periods for each Course
                </h1>

                {!allCoursesTeeTimesOpenings && (
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

                {allCoursesTeeTimesOpenings && (
                    <div>
                        <div className="flex items-center px-6 mb-12">
                            <div
                                className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
                                role="group"
                            >
                                {options.map((option, i) => (
                                    <div key={i}>
                                        <a
                                            onClick={() => {
                                                setSelectedOption(option)
                                            }}
                                            className={clsx(
                                                i === 0 && 'rounded-l ',
                                                i + 1 === options.length &&
                                                    'rounded-r',
                                                ' px-6 py-1 cursor-pointer bg-slate-500 text-white  text-xs leading-tight uppercase hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-0 active:bg-slate-700 transition duration-150 ease-in-out',
                                                selectedOption.id ===
                                                    option.id && 'bg-slate-800'
                                            )}
                                        >
                                            {option.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-8">
                            {chartData && (
                                <ReactApexChart
                                    options={chartData.options}
                                    series={chartData.series}
                                    type="bar"
                                    height={
                                        selectedOption.id === 1 ? 100 : 1200
                                    }
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PeriodsChart
