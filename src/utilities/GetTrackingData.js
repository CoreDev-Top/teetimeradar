const GetTrackingData = async (trackingDataName) => {
    const token = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : ''
    try {
        const response = await fetch(
            `${global.SERVER_HOST}/api/analytics/tracking/${trackingDataName}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        const data = await response?.json()
        // const options = { timeZone: 'America/Los_Angeles' }
        // const today = new Date();

        // // Subtract one day (24 hours) from today's date
        // let yesterday = new Date(today);
        // yesterday.setDate(today.getDate() - 1);

        // yesterday = new Date(yesterday)
        //     .toLocaleString('en-US', {
        //         timeZone: 'America/Los_Angeles',
        //         ...options,
        //     })
        //     .slice(0, 10)
        //     .replace(/,/g, '')

        // let dayBeforeYesterday = new Date(today);
        // dayBeforeYesterday.setDate(today.getDate() - 2);

        // dayBeforeYesterday = new Date(dayBeforeYesterday)
        //     .toLocaleString('en-US', {
        //         timeZone: 'America/Los_Angeles',
        //         ...options,
        //     })
        //     .slice(0, 10)
        //     .replace(/,/g, '')
        // if (trackingDataName === 'churnedGolfersTracking') {
        //     const d = Object?.keys(data)?.map((key) =>
        //         (
        //             Object.values(data?.[key])?.reduce(
        //                 (a, b) => a + b,
        //                 0
        //             ) /
        //             Object.keys(data?.[key])?.length
        //         ).toFixed(0))
        //     const labels = Object?.keys(data)?.map((key) => key)
        //     console.log('churnedGolfersTrackingData', data)
        //     console.log('churnedGolfersTracking', d)
        //     console.log('labels', labels)
        //     console.log('yesterday', yesterday)
        //     console.log('dayBeforeYesterday', dayBeforeYesterday)
        //     console.log('churnedGolfersTrackingDataToday', data[yesterday])
        //     const yesterdayData = (Object.values(data[yesterday])?.reduce(
        //         (a, b) => a + b,
        //         0
        //     ) / Object.keys(data[yesterday])?.length).toFixed(0)
        //     console.log('yesterdayData', yesterdayData)

        //     const dayBeforeYesterdayData = (Object.values(data[dayBeforeYesterday])?.reduce(
        //         (a, b) => a + b,
        //         0
        //     ) / Object.keys(data[dayBeforeYesterday])?.length).toFixed(0)
        //     console.log('dayBeforeYesterdayData', dayBeforeYesterdayData)

        //     console.log(`churned subscribers on ${yesterday} is ${yesterdayData - dayBeforeYesterdayData}`)
        // }
        // if (trackingDataName === 'activeAlertsCountTracking') {
        //     const activeAlertsYesterday = (Object.values(data[yesterday])?.reduce(
        //         (a, b) => a + b,
        //         0
        //     ) / Object.keys(data[yesterday])?.length).toFixed(0)
        //     console.log('activeAlertsYesterday', activeAlertsYesterday)
        // }

        return data
    } catch (e) {
        console.error(e.message)
    }
}

export default GetTrackingData
