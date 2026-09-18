
function getReverseGeocode(geolocation: Geolocation): string {
    return `https://api.bigdatacloud.net/data/reverse-geocode-client?
        latitude=${geolocation.latitude}&
        longitude=${geolocation.longitude}`.replaceAll(' ', '');
}

export interface Geolocation {
    latitude: number,
    longitude: number
}

export function getCity(geolocation: Geolocation): Promise<string> {
    return window.fetch(getReverseGeocode(geolocation))
        .then((res) => res.json())
        .then((res) => res.city);
}
