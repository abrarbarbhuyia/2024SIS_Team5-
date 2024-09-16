export function capitaliseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatTextValue(value: string) {
    return value.trim().toLowerCase();
}