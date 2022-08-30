const epochToDate = (epoch: number) : Date => {
    const date = new Date(0)
    date.setUTCMilliseconds(epoch)
    return date
}

const getWeek = (date: Date) : number => {
    const oneJan = new Date(date.getFullYear(),0,1);
    const numberOfDays = Math.floor(((date as any) - (oneJan as any)) / (24 * 60 * 60 * 1000));
    const result = Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
    return result
}

export {epochToDate, getWeek}