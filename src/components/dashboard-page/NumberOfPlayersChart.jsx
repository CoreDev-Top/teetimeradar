import React, { useEffect, useState, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

function CalculatePlayersData(teeTimesNumberOfPlayers) {
    if (!teeTimesNumberOfPlayers) return [{}]
    return Object.values(teeTimesNumberOfPlayers).reduce((acc, val) => {
        Object.entries(val).forEach(([players, count]) => {
            acc[players] = acc[players] || 0
            acc[players] += count
        })
        return acc
    }, {})
}

const NumberOfPlayersChart = ({ teeTimesNumberOfPlayers }) => {
    const playersData = useMemo(
        () => CalculatePlayersData(teeTimesNumberOfPlayers),
        [teeTimesNumberOfPlayers]
    )

    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        if (!playersData) return
        const totalTeeTimes = Object.values(playersData).reduce(
            (sum, val) => sum + val,
            0
        )

        setChartData({
            series: Object.keys(playersData).map((key) => ({
                name: `${key} Players`,
                data: [(playersData[key] / totalTeeTimes) * 100],
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
                    categories: ['Tee Times By N° Of Players'],
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
                            const players = Object.keys(playersData)
                            return `${playersData[players[index]]} Tee Times`
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
    }, [playersData])

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
                    Number of Tee Times by Available Players
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

export default NumberOfPlayersChart
