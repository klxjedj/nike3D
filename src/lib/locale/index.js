
import {
    __detectLangLocale,
    __setTestCampaignCookies,
    __clearTestCampaignCookies,
    __getLocalizedStringFromKey,
    __userLang,
    __loadLocalization,
    __getUserLocalization,
    __userCountry,
    __userLocale,
    __EMEA,
    __userCartByCountry,
    __userCommerceByCountry,
    __userLaunchByCountry,
    __userSunsetByCountry,
    __user
} from './localization/localization.js';
import { isEvent } from '../common.js';

__detectLangLocale();

__loadLocalization(__userLang(), () => {
    //console.debug('User localization loaded');
});

let COMMERCE = true;
let COUNTRY = __userCountry().toUpperCase() || 'US';
let LOCALE = __userLocale().toLowerCase();
let upper = LOCALE.split('');
for (let i = 0; i < upper.length; i++) {
    if (i === upper.length - 1 || i === upper.length - 2) {
        upper[i] = upper[i].toUpperCase();
    }
}
LOCALE = upper.join('');

export const getSizeType = () => {
    // US, EU, JP, CN, XP
    // You're wondering what XP is ... aren't you.
    // Merchgroup - XP (GlobalStore):
    // https://confluence.nike.com/display/OCP/NikeReservationControl+-+For+PS+Launch+Operations
    switch (getCountry()) {
        case 'US':
            return 'US';
        case 'JP':
            return 'JP';
        case 'CN':
            return 'CN';
        default:
            return __EMEA() ? 'EU' : 'XP';
    }
}

export const isEmea = () => {
    return __EMEA()
}

export const getLocale = () => {
    return LOCALE;
}

export const getCountry = () => {
    return COUNTRY;
}

export const getCartRegion = () => {
    return __userCartByCountry().toLowerCase();
}

export const disableCommerce = () => {
    COMMERCE = false;
}

export const isCommerce = () => {
    // return getCountry() == 'US';
    // return COMMERCE;
    // return true;
    let result = COMMERCE && __userCommerceByCountry() === 'COMMERCE';
    console.info('isCommerce', result)
    return result;
}

export const getText = (key) => {
    let text = __getLocalizedStringFromKey(key);
    if (text) {
        return text;
    }
    // console.info(key, 'Not found in localized json');
    // return key;
}



export let LAUNCH = new Date(1566835200000).getTime();

// export let LAUNCH = new Date().getTime();

// try {
//     let h = window.location.hostname.toLowerCase()
//     if (h.indexOf("localhost") >= 0 || h.indexOf("-stage") >= 0) {
//         // // test environment march 1 2019 PST
//         // export let LAUNCH = new Date(1551459600000).getTime();
//         console.log('SETTING LAUNCH TO A DIFFERENT DATE, LOCAL DEVELOPMENT DETECTED');
//         LAUNCH = new Date(1551459600000).getTime();
//     }
// } catch (error) {

// }

export const hasLaunched = () => {

    if (isEvent()) {
        return true;
    }

    // global launch design
    return new Date(LAUNCH).getTime() <= new Date().getTime();

    // region / country based design
    // return new Date(__userLaunchByCountry()).getTime() <= new Date().getTime();
}

// 2020
export const SUNSET = new Date(1577865600000).getTime();

export const isSunset = () => {

    // global sunset design
    return SUNSET <= new Date().getTime();

    // region / country based design
    // return new Date(__userSunsetByCountry()).getTime() <= new Date().getTime();
}

export const getMyFlag = () => {
    let map = {
        "us": "LTITEM375933",
        "ca": "LTITEM384983",
        "mx": "LTITEM375928",
        "ar": "LTITEM375921",
        "br": "LTITEM375922",
        "cl": "LTITEM399254",
        "de": "LTITEM375925",
        "es": "LTITEM375931",
        "fr": "LTITEM375924",
        "it": "LTITEM375926",
        "nl": "LTITEM375929",
        "pt": "LTITEM375930",
        "ru": "LTITEM383985",
        "se": "LTITEM381712",
        "ch": "LTITEM375932",
        "gb": "LTITEM375923",
        "au": "LTITEM399249",
        "ph": "LTITEM399250",
        "jp": "LTITEM375927"
    }

    return map[__userCountry().toLowerCase()]
}