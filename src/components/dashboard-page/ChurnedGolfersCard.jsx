import React from 'react'
import ReactApexChart from 'react-apexcharts'

const ChurnedGolfersCard = ({
    churnedGolfersCount,
    golfersSubscriptionStatusCount,
    color,
}) => {
    const chartData = {
        series: [
            {
                name: 'Golfers',
                data: !churnedGolfersCount
                    ? []
                    : Object?.keys(churnedGolfersCount)?.map((key) =>
                          (
                              Object.values(churnedGolfersCount?.[key])?.reduce(
                                  (a, b) => a + b,
                                  0
                              ) /
                              Object.keys(churnedGolfersCount?.[key])?.length
                          ).toFixed(0)
                      ),
            },
        ],
        options: {
            chart: {
                type: 'area',
                height: 350,
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                },
                sparkline: {
                    enabled: true,
                },

                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: false,
                        delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350,
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            // eslint-disable-next-line no-sparse-arrays
            colors: [color, '#F1416C', , '#50CD89', '#FFC700', '#7239EA'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.5,
                    stops: [0, 100],
                },
            },

            labels: !churnedGolfersCount
                ? []
                : Object?.keys(churnedGolfersCount)?.map((key) => key),
            xaxis: {
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
            yaxis: {
                opposite: true,
                labels: {
                    show: false,
                },
            },

            grid: {
                padding: {
                    bottom: 10,
                },
                strokeDashArray: 4,
                // hide horizontal grid lines
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            legend: {
                horizontalAlign: 'left',
            },
        },
    }
    const options = { timeZone: 'America/Los_Angeles' }
    const today = new Date()
        .toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            ...options,
        })
        .slice(0, 10)
        .replace(/,/g, '')

    return (
        <div>
            <div
                className="block py-6 pb-0 rounded-xl shadow-sm bg-white  my-8"
                style={{
                    maxWidth: '300px',
                    height: 'fit-content',
                }}
            >
                {!churnedGolfersCount && (
                    <div
                        role="status"
                        className=" animate-pulse mb-8"
                        style={{ height: '220px' }}
                    >
                        <div
                            className=" bg-gray-200 rounded-xl dark:bg-gray-700  "
                            style={{
                                height: '100%',
                                width: '90%',
                                margin: 'auto',
                            }}
                        />
                    </div>
                )}
                {churnedGolfersCount && (
                    <div>
                        <p
                            className="text-3xl font-semibold text-slate-700 dark:text-navy-100 pl-6"
                            style={{ fontSize: '22px', marginBottom: '4px' }}
                        >
                            {
                                churnedGolfersCount?.[today]?.[
                                    Math.max(
                                        ...Object.keys(
                                            churnedGolfersCount?.[today]
                                        ).map((key) => parseInt(key, 10))
                                    )
                                        .toString()
                                        .padStart(2, '0')
                                ]
                            }{' '}
                            <span style={{ color }}> Churned Users </span>
                        </p>
                        <div
                            className="flex  text-xs pl-6 absolute "
                            style={{ marginBottom: '16px', opacity: '0.8' }}
                        >
                            <span style={{ fontWeight: '500' }}>
                                {golfersSubscriptionStatusCount?.canceled || 0}{' '}
                                <span style={{ color }}>Canceled</span>
                            </span>
                            <span className="px-2 font-semibold "> / </span>
                            <span style={{ fontWeight: '500' }}>
                                {golfersSubscriptionStatusCount?.paused || 0}{' '}
                                <span style={{ color }}>Paused</span>
                            </span>
                            <span className="px-2 font-semibold "> / </span>
                            <span style={{ fontWeight: '500' }}>
                                {golfersSubscriptionStatusCount?.payment_failed ||
                                    0}{' '}
                                <span style={{ color }}>Failed Payment</span>
                            </span>
                        </div>
                        <ReactApexChart
                            options={chartData?.options}
                            series={chartData?.series}
                            type="area"
                            height={100}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChurnedGolfersCard
