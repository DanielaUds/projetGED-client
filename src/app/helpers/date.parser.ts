export const parseDate = (date: Date) => {
    date = new Date(date);
    let result = pad(date.getDate(), 2, '0') +'-'+ pad(date.getMonth() + 1, 2, '0') + '-' + date.getFullYear()+' at ' + date.getHours() + ':' + date.getMinutes();
    return result;
}

export const pad = (s, width, character) => {
    return new Array(width - s.toString().length + 1).join(character) + s;
}