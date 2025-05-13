const UpdateGolferRecord = async (id, columns, newValues, token) => {
    // update duration inside db using PUT with route /api/dashboard

    try {
        await fetch(`${global.SERVER_HOST}/api/golfer`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id,
                columns,
                newValues,
            }),
        })
        console.log('%c golfer  updated successfully ', 'color: green')
    } catch (e) {
        console.error(`error when trying to update golfer ${e.message}`)
    }
}

export default UpdateGolferRecord
