const epochToDate = (epoch: number) : Date => {
    const date = new Date(0)
    date.setUTCMilliseconds(epoch)
    return date
}

export {epochToDate}