import React, { useEffect, useState, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

const categories = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

function CalculateWeekdaysData(teeTimesWeekdays) {
    if (!teeTimesWeekdays) return [{}]
    return Object.values(teeTimesWeekdays).reduce((acc, val) => {
        Object.entries(val).forEach(([weekday, count]) => {
            acc[weekday] = acc[weekday] || 0
            acc[weekday] += count
        })
        return acc
    }, {})
}

const TeeTimesPerWeekdayChart = ({ teeTimesWeekdays }) => {
    const weekdaysData = useMemo(
        () => CalculateWeekdaysData(teeTimesWeekdays),
        [teeTimesWeekdays]
    )

    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        if (!weekdaysData) return
        const totalTeeTimes = Object.values(weekdaysData).reduce(
            (sum, val) => sum + val,
            0
        )

        setChartData({
            series: categories.map((weekday) => ({
                name: weekday,
                data: [(weekdaysData[weekday] / totalTeeTimes) * 100 || 0],
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
                    categories: ['Tee Times By Weekday'],
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
                            const weekdays = categories
                            return `${weekdaysData[weekdays[index]]} Tee Times`
                        },
                    },
                },
                fill: {
                    opacity: 1,
                    colors: [
                        '#2E93E8', // Monday
                        '#00e396', // Tuesday
                        '#FFC107', // Wednesday
                        '#ff4560', // Friday
                        '#2faf20', // Thursday
                        '#9C27B0', // Saturday
                        '#af7620', // Sunday
                    ],
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40,
                    markers: {
                        fillColors: [
                            '#2E93E8', // Monday
                            '#00e396', // Tuesday
                            '#FFC107', // Wednesday
                            '#ff4560', // Friday
                            '#2faf20', // Thursday
                            '#9C27B0', // Saturday
                            '#af7620', // Sunday
                        ],
                    },
                },
            },
        })
    }, [weekdaysData])

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
                    Preferred Weekdays for Receiving Alerts
                </h1>
                {chartData && (
                    <div className="px-8">
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height={100}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeeTimesPerWeekdayChart
