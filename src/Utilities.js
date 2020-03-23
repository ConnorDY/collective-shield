const buildEndpointUrl = (path) => {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.hostname}:3050/api/${path}`
    }
    return `${window.location.origin}/api/${path}`
}

export {
    buildEndpointUrl,
}