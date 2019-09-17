export const isMobile = () => {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return w <= 600;
}

export const isEvent = (eventId = 'earlyaccess') => {
    return (window.location.pathname.indexOf(eventId) >= 0)
}

export const isProduction = () => {

    try {
        return window.location.host === 'nikebyyou.nike.com';
    } catch (error) {

    }

    return true;
}


export const isStaging = () => {
    try {
        return window.location.host === 'nikebyyou-stage.nike.com' && !window.location.pathname.startsWith('/_');
    } catch (error) {

    }

    return false;
}