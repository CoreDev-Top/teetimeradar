import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const GolfersPerCityChart = () => {
    const GetGolfersPerCityData = async () => {
        try {
            const token = localStorage.getItem('jwt')
                ? localStorage.getItem('jwt')
                : ''
            const response = await fetch(
                `${global.SERVER_HOST}/api/golfer/subscription-status-per-state`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            return data // .slice(0, 10)
        } catch (e) {
            console.error(e.message)
        }
    }

    const [golfersPerCityData, setGolfersPerCityData] = useState([])
    useEffect(() => {
        GetGolfersPerCityData().then((data) => {
            setGolfersPerCityData(data)
        })
    }, [])
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                fontFamily: 'Urbanist',

                height: 500,
                stacked: true,
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ['#fff'],
            },

            xaxis: {
                categories: [],
                labels: {
                    formatter(val) {
                        return val
                    },
                },
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
                title: {
                    text: undefined,
                },
            },
            tooltip: {
                y: {
                    formatter(val) {
                        return val
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

    useEffect(() => {
        GetGolfersPerCityData().then((data) => {
            // filter out entries with null cities
            const filteredData = data.filter(
                (cityData) => cityData.golfer_state !== null
            )

            // create an array of city names
            const cities = filteredData.map((cityData) => cityData.golfer_state)

            const seriesData = [
                {
                    name: 'Free Trial',
                    data: filteredData.map((cityData) =>
                        Number(cityData.free_trial)
                    ),
                },

                {
                    name: 'Free Trial Over',
                    data: filteredData.map((cityData) =>
                        Number(cityData.free_trial_over)
                    ),
                },
                {
                    name: 'Active',
                    data: filteredData.map((cityData) =>
                        Number(cityData.active)
                    ),
                },
                {
                    name: 'Canceled',
                    data: filteredData.map((cityData) =>
                        Number(cityData.canceled)
                    ),
                },
                {
                    name: 'Paused',
                    data: filteredData.map((cityData) =>
                        Number(cityData.paused)
                    ),
                },
                {
                    name: 'Payment Failed',
                    data: filteredData.map((cityData) =>
                        Number(cityData.payment_failed)
                    ),
                },
                {
                    name: 'In Grace Period',
                    data: filteredData.map((cityData) =>
                        Number(cityData.paused)
                    ),
                },
            ]

            // set the state with the new data
            setChartData((prevState) => ({
                ...prevState,
                series: seriesData,
                options: {
                    ...prevState.options,

                    xaxis: {
                        ...prevState.options.xaxis,
                        categories: cities,
                    },
                },
            }))
        })
    }, [])

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
                    Golfers Per State
                </h1>

                {!(chartData.series.length && golfersPerCityData.length) && (
                    <div
                        role="status"
                        className="pulsing mb-8"
                        style={{ height: '350px' }}
                    >
                        <div
                            className="bg-gray-200 rounded-xl dark:bg-gray-700"
                            style={{
                                height: '350px',
                                width: '90%',
                                margin: 'auto',
                            }}
                        />
                    </div>
                )}

                <div className="px-8">
                    {chartData.series.length && golfersPerCityData.length && (
                        <ReactApexChart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height={700}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
export default GolfersPerCityChart
