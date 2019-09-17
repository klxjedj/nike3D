
import { __addClass, __removeClass, __hashArray, __getParameterByName } from '../utils/Utilities';
import { __cookie, __cookieDomain, __cookieSecure } from '../utils/Cookies';
import { isEvent } from '../../common';
/*
const __ALL_JSON__ = {
	'ca': require('../json/ca.json'),
	'cs': require('../json/cs.json'),
	'da': require('../json/da.json'),
	'de': require('../json/de.json'),
	'el': require('../json/el.json'),
	'en-gb': require('../json/en-gb.json'),
	'en-us': require('../json/en-us.json'),
	'en': require('../json/en-us.json'),
	'es-ar': require('../json/es-ar.json'),
	'es-la': require('../json/es-la.json'),
	'es-mx': require('../json/es-mx.json'),
	'es': require('../json/es.json'),
	'fr': require('../json/fr.json'),
	'hu': require('../json/hu.json'),
	'it': require('../json/it.json'),
	'ja': require('../json/ja.json'),
	'ko': require('../json/ko.json'),
	'nl': require('../json/nl.json'),
	'no': require('../json/no.json'),
	'pl': require('../json/pl.json'),
	// 'pt-br': require('../json/pt-br.json'),
	'pt-br': require('../json/en.json'),
	'pt': require('../json/pt.json'),
	'ru': require('../json/ru.json'),
	'sv': require('../json/en-us.json'),
	// 'sv': require('../json/sv.json'),
	'th': require('../json/th.json'),
	'tr': require('../json/tr.json'),
	'zh-cn': require('../json/zh-cn.json'),
	'zh-tw': require('../json/zh-tw.json'),
}
*/
/* ————————————————————————————————————————————————————————————— */

const REQUIRE_LANG_TUNNEL = new Date().getTime() > 1562774400000 && new Date().getTime() < 1594364400000; //false;
// const REQUIRE_LANG_TUNNEL = true;

// Defaults
const __default_lang__ = 'en-us';
const __default_locale__ = 'en_us';
const __default_country__ = 'us';

// Consumer Choices
var __lang__ = false;
var __locale__ = '';
var __country__ = '';

// Localized 

const LOC_FOLDER = "/json/";
var __LOCALIZED_JSON__ = {};


// Language Tunnel 
// const __LANG_TUNNEL__ = 'langtunnel';

// Testing
const __LANG_TUNNEL__ = `langtunnel/#${window.location.origin}${window.location.pathname}${window.location.search}`;


/* ————————————————————————————————————————————————————————————— */

// Countries 


const COUNTRIES = {

	"us": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'US', 'region': 'NA', 'commerce': 'COMMERCE', name: 'United States'}, //UNITED STATES

	"ca": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'NA', 'commerce': 'COMMERCE', name: 'Canada'}, //CANADA
	"mx": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'NA', 'commerce': 'COMMERCE', name: 'México'}, //MÉXICO
	"pr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'NA', 'commerce': 'COMMERCE', name: 'Puerto Rico'}, //PUERTO RICO

	"xl": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'SA', 'commerce': 'NON_COMMERCE', name: 'América Latina'}, //AMÉRICA LATINA
	"ar": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'SA', 'commerce': 'NON_COMMERCE', name: 'Argentina'}, //ARGENTINA
	"br": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'SA', 'commerce': '3PL', name: 'Brasil'}, //BRASIL
	"cl": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'SA', 'commerce': 'COMMERCE', name: 'Chile'}, //CHILE
	"uy": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'SA', 'commerce': 'NON_COMMERCE', name: 'Uraguay'}, //URUGUAY

	"be": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Belgium'}, //BELGIUM
	"bg": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Bulgaria'}, //BULGARIA
	"cz": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Česká republika'}, //ČESKÁ REPUBLIKA
	"hr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Croatia'}, //CROATIA
	"dk": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Danmark'}, //DANMARK
	"de": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Deutschland'}, //DEUTSCHLAND
	"gr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Ελλάδα'}, //ΕΛΛΑΔΑ (greece)
	"es": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'España'}, //ESPAÑA
	"fi": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Finland'}, //FINLAND
	"fr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'France'}, //FRANCE
	"ie": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Ireland'}, //IRELAND
	"il": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Israel'}, //ISRAEL
	"it": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Italia'}, //ITALIA
	"lu": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Luxembourg'}, //LUXEMBOURG
	"hu": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Magyarország'}, //MAGYARORSZÁG
	"nl": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Nederland'}, //NEDERLAND
	"no": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Norge'}, //NORGE
	"at": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Österreich'}, //ÖSTERREICH
	"pl": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Polska'}, //POLSKA
	"pt": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Portogal'}, //PORTUGAL
	"ru": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Россия'}, //РОССИЯ (Russia)
	"ro": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Romania'}, //ROMANIA
	"sk": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Slovakia'}, //SLOVAKIA
	"si": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Slovenia'}, //SLOVENIA
	"se": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Sverige'}, //SVERIGE (Sweeden)
	"ch": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Switzerland'}, //SWITZERLAND
	"tr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'EU', 'commerce': 'COMMERCE', name: 'Türkiye'}, //TÜRKİYE
	"gb": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'EU', 'region': 'EU', 'commerce': 'COMMERCE', name: 'United Kingdom'}, // UNITED KINGDOM

	"au": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'Australia'}, //AUSTRALIA
	"hk": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': '3PL', name: 'Hong Kong'}, //HONG KONG
	
	"in": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'India'}, //INDIA *
	"id": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'Indonesia'}, //INDONESIA *
	"my": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'Malaysia'}, //MALAYSIA *
	"nz": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'New Zealand'}, //NEW ZEALAND
	"ph": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'NON_COMMERCE', name: 'Philippines'}, //PHILIPPINES
	"sg": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'Singapore'}, //SINGAPORE *
	"vn": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'Vietnam'}, //VIETNAM

	"cn": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: ' 中国大陆'}, // 中国大陆 (China)
	"tw": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: '台灣'},	//台灣 (Taiwan)
	"jp": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: '日本'}, //日本 (Japan)
	"kr": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': '3PL', name: '대한민국'}, //대한민국 (Korea)
	"th": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AP', 'commerce': 'COMMERCE', name: 'ประเทศไทย'}, //ประเทศไทย (thailand) 

	"sa": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'ME', 'commerce': 'COMMERCE', name: 'Saudi Arabia'}, //SAUDI ARABIA
	"ae": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'ME', 'commerce': 'COMMERCE', name: 'United Arab Emirates'}, //UNITED ARAB EMIRATES
	"xm": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'ME', 'commerce': 'NON_COMMERCE', name: 'Middle East'}, //REST OF MIDDLE EAST

	"eg": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AF', 'commerce': 'COMMERCE', name: 'Egypt'}, //EGYPT
	"ma": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AF', 'commerce': 'COMMERCE', name: 'Maroc'}, //MAROC
	"za": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AF', 'commerce': 'COMMERCE', name: 'South Africa'}, //SOUTH AFRICA
	"xf": { sunset: 1594364400000, launch: 1562774400000, 'cart': 'AP', 'region': 'AF', 'commerce': 'NON_COMMERCE', name: 'Africa' } //REST OF AFRICA

};



// Locale » Language

const LOCALE_LANG = {
	'ca_es': 'ca',  			// Catalin
	'cs_cz': 'cs',  			// Czech
	'de_de': 'de',  			// German
	'da_dk': 'da',  			// Danish
	'el_gr': 'el',  			// Greek
	'en_us': 'en-us',  	// US
	'en_gb': 'en',  			// UK
	'es_la': 'es-la',  	// Spanish, Latin America
	'es_mx': 'es-mx',  	// Spanish, Mexico
	'es_ar': 'es-ar',  	// Spanish, Argentina
	'es_es': 'es',  			// Spanish, Spain
	'fr_fr': 'fr',  			// French
	'hu_hu': 'hu',  			// Hungarian
	'it_it': 'it',  			// Italian
	'ja_jp': 'ja',  			// Japanese
	'ko_kr': 'ko',  			// Korean
	'no_no': 'no',  			// Norway
	'nl_nl': 'nl',			  // Dutch, Netherlands
	'pl_pl': 'pl',  			// Polish
	'pt_pt': 'pt',  			// Portuguese
	'pt_br': 'pt-br',		// Portuguese, Brazil
	'ru_ru': 'ru',  			// Russian
	'sv_se': 'sv',  			// Swedish
	'th_th': 'th',			  // Thai
	'tr_tr': 'tr',  			// Turkey
	'zh_cn': 'zh-cn', 		// Chinese (simplified)
	'zh_tw': 'zh-tw'  		// Chinese (traditional)
};

/* ————————————————————————————————————————————————————————————— */

// All Locales
const LOCALES = {
	'ca_es': 'ca_es',  		// Catalin
	'cs_cz': 'cs_cz',  		// Czech
	'de_de': 'de_de',  		// German
	'da_dk': 'da_dk',  		// Danish
	'el_gr': 'el_gr',  		// Greek
	'en_us': 'en_us',  		// US
	'en_gb': 'en_gb',  		// UK
	'es_la': 'es_la',  		// Spanish, Latin America
	'es_mx': 'es_mx',  		// Spanish, Mexico
	'es_ar': 'es_ar',  		// Spanish, Argentina
	'es_es': 'es_es',  		// Spanish, Spain
	'fr_fr': 'fr_fr',  		// French
	'hu_hu': 'hu_hu',  		// Hungarian
	'it_it': 'it_it',  		// Italian
	'ja_jp': 'ja_jp',  		// Japanese
	'ko_kr': 'ko_kr',  		// Korean
	'no_no': 'no_no',  		// Norway
	'nl_nl': 'nl_nl',			// Dutch, Netherlands
	'pt_pt': 'pt_pt',  		// Portuguese
	'pl_pl': 'pl_pl',  		// Polish
	'pt_br': 'pt_br',			// Portuguese, Brazil
	'ru_ru': 'ru_ru',  		// Russian
	'th_th': 'th_th',			// Thai
	'tr_tr': 'tr_tr',  		// Turkey
	'sv_se': 'sv_se',  		// Swedish
	'zh_cn': 'zh_cn',  		// Chinese (simplified)
	'zh_tw': 'zh_tw'
}  		// Chinese (traditional)

/* ————————————————————————————————————————————————————————————— */

// EMEA Locales
const EMEA = [
	'en_lu', 						// luxemburg
	'en_at', 						// austria
	'en_be', 						// belgium
	'en_dk', 						// denmark
	'en_fi', 						// finland
	'en_gb', 						// united kingdom
	'en_ie', 						// ireland
	'en_nl', 						// netherlands
	'en_pt', 						// portugal
	'en_se', 						// sweden
	'fr_lu', 						// luxemburg
	'fr_be', 						// belgium
	'fr_fr', 						// france
	'de_lu', 						// luxemburg
	'de_at', 						// austria
	'de_be', 						// belgium
	'de_de', 						// germany
	'it_it', 						// italy
	'es_es', 						// spain
	'ca_es', 						// catalan
	'nl_be', 						// belgium
	'nl_nl', 						// netherlands
	'da_dk', 						// denmark
	'sv_se', 						// sweden
	'pt_pt', 						// portugal
	'en_no', 						// norway
	'en_ch', 						// switzerland
	'fr_ch', 						// switzerland
	'de_ch', 						// switzerland
	'it_ch', 						// switzerland
	'no_no', 						// norway
	'en_cz', 						// czech republic
	'en_hu', 						// hungary
	'en_si', 						// slovenia
	'pl_pl', 						// poland
	'el_gr', 						// greece
	'hu_hu', 						// hungary
	'cs_cz', 						// czech republic
	'en_ae', 						// united arab emirates
	'en_bg', 						// bulgaria
	'en_hr', 						// croatia
	'en_il', 						// israel
	'en_ro', 						// romania
	'en_sa', 						// saudi arabia
	'en_sk', 						// slovakia
	'tr_tr', 						// turkey
	'ru_ru', 						// russia
	'en_ca', 						// canada
	'en_eg', 						// egypt
	'en_ma', 						// morocco
	'en_za', 						// south africa
	'fr_ca', 						// canada
	'fr_ma', 						// morocco
	'es_pr'  						// puerto rico
]

/* ————————————————————————————————————————————————————————————— */

function __userLocale() {
	return __locale__;
}

function __userLang() {
	if (__lang__) {
		return (__lang__);
	}

	return __default_lang__;
}

function __userCountry() {
	return __country__;
}

function __userCountryName() {
	return COUNTRIES[__country__].name
}

function __userRegionByCountry() {
	return COUNTRIES[__country__] && COUNTRIES[__country__].region;
}

function __userCartByCountry() {
	return COUNTRIES[__country__] && COUNTRIES[__country__].cart;
}

function __userCommerceByCountry() {
	return COUNTRIES[__country__] && COUNTRIES[__country__].commerce;
}

function __userLaunchByCountry() {
	return COUNTRIES[__country__] && COUNTRIES[__country__].launch;
}

function __userSunsetByCountry() {
	return COUNTRIES[__country__] && COUNTRIES[__country__].sunset;
}

window.invalidKeys = {}
function __getLocalizedStringFromKey(key) {

	// //console.debug('GET COPY FOR KEY: ' + key + ' : ' + __userLang() + ' : %c ' + __LOCALIZED_JSON__[key], 'background: #00cc00; color: #fff');

	let lang = __userLang();
	if (__LOCALIZED_JSON__[key] != undefined) {
		return __LOCALIZED_JSON__[key];
	} else {
		window.invalidKeys[key] = key
		return key;
	}

}

function __getUserLocalization() {
	//console.debug('%c USER LOCALE: ' + __userLocale(), 'background: #222; color: #bada55');
	//console.debug('%c USER LANGUAGE: ' + __userLang(), 'background: #222; color: #bada55');
	//console.debug('%c USER COUNTRY: ' + __userCountry(), 'background: #222; color: #bada55');
	//console.debug('%c USER REGION: ' + __userRegionByCountry(), 'background: #222; color: #bada55');

	return { locale: __userLocale(), lang: __userLang(), country: __userCountry(), region: __userRegionByCountry() }
}


/* ————————————————————————————————————————————————————————————— */

function __setLang(lang) {
	__lang__ = lang;
}

function __setLocale(loc) {
	__locale__ = loc;

	// For CSS overrides by geo 
	__setBodyClass(__userLocale().toLowerCase());
}

function __setCountry(c) {
	__country__ = c;
	__setBodyClass(__userCountry().toLowerCase());
	__setBodyClass('region-' + __userRegionByCountry().toLowerCase());
}

function __setDefaultLang() {
	__setLocale(__default_locale__);
}

function __setBodyClass(className) {
	let body = document.querySelector('body');
	__addClass(body, className);
	__addClass(body, className);
}


/* ————————————————————————————————————————————————————————————— */
// Sets the user locale based on the language they chose. 

function __setCookies() {

	//console.debug('%c SETTING COOKIES: ' + __userCountry() + "/" + __userLocale(), 'background: #ccff66; color: #000');

	var NIKE_COMMERCE_LANG_LOCALE = __cookie.setItem('NIKE_COMMERCE_LANG_LOCALE', __userLocale(), Infinity, '/', __cookieDomain(), __cookieSecure());

	var CONSUMERCHOICE = __cookie.setItem('CONSUMERCHOICE', __userCountry() + "/" + __userLocale(), Infinity, '/', __cookieDomain(), __cookieSecure());

	var nike_locale = __cookie.setItem('nike_locale', __userCountry() + "/" + __userLocale(), Infinity, '/', __cookieDomain(), __cookieSecure());

	var NIKE_COMMERCE_COUNTRY = __cookie.setItem('NIKE_COMMERCE_COUNTRY', __userCountry(), Infinity, '/', __cookieDomain(), __cookieSecure());

}

function __setLocaleCookie(locale) {


}

function __setCountryCookie(country) {

}

/* ————————————————————————————————————————————————————————————— */
// Special Formatting Helpers

function __formatTurkish(string) {
	var newstring = string;
	newstring = newstring.split('i').join('İ');
	newstring = newstring.split("'").join("´");
	return newstring
}

function __EMEA() {
	if (EMEA.indexOf(__userLocale().toLowerCase()) > -1) {
		return true;
	} else {
		return false
	}

}

/* ————————————————————————————————————————————————————————————— */
// Detection

function __localeMatchesLang(loc) {

	let lang = (LOCALE_LANG[loc.toLowerCase()] != undefined) ? LOCALE_LANG[loc.toLowerCase()] : false;


	//console.debug('%c LOCALE MATCHES LANGUAGE: ' + loc + ' : ' + lang, 'background: #ffccb3; color: #fff');

	if (lang != false) {
		__setLang(lang);
		__setLocale(loc);
		return true;
	}

	return false;

}

function __countryIsValid(country) {

	if (Object.keys(COUNTRIES).indexOf(country.toLowerCase()) > -1) {
		return true;
	} else {
		return false;
	}

}

function __validateLangLocale(langlocale) {


	////console.debug('%c VALIDATING LOCALE', 'background: #ffccb3; color: #fff');


	let validLang = false,
		validCountry = false;

	if (langlocale.locale) {

		var langMatch = __localeMatchesLang(langlocale.locale.toLowerCase());

		//console.debug('%c LANGUAGE VALID:' + langMatch, 'background: #ffccb3; color: #fff');

		validLang = true;

		if (langlocale.country) {
			//console.debug('%c Validating country ' + langlocale.country, 'color: #ccc');
			validCountry = __countryIsValid(langlocale.country);

			if (validCountry) {
				__setCountry(langlocale.country.toLowerCase())
				//console.debug('%c COUNTRY VALID', 'background: #ffccb3; color: #fff');
			} else {
				//console.debug('%c COUNTRY NOT VALID', 'background: #ffccb3; color: #fff');
			}

		}

		if (!validCountry && langlocale.locale.split("_").length > 1) {

			//console.debug('%c Validating country from locale ' + langlocale.locale.split('_')[1], 'color: #ccc');

			validCountry = __countryIsValid(langlocale.locale.split('_')[1]);

			if (validCountry) {
				//console.debug('%c COUNTRY VALID', 'background: #ffccb3; color: #fff');
				__setCountry(langlocale.locale.split('_')[1])

			} else {
				//console.debug('%c COUNTRY NOT VALID:' + langlocale.locale.split('_')[1], 'background: #ffccb3; color: #fff');
			}

		}

		if (!validCountry) {

			//console.debug('%c COUNTRY NOT VALID, SETTING TO DEFAULT', 'background: #ffccb3; color: #fff');

			__setCountry(__default_country__);

			validCountry = true;

		}

	}

	const validLocale = (validLang && validCountry)
	if (validLocale) {
		//console.debug('%c DETECTED LOCALE', 'background: #00cc00; color: #fff');
	} else {
		//console.debug('%c NO LOCALE', 'background: #ff944d; color: #000');
	}
	return validLocale

}

function __detectLangLocale(detect = 'all') {

	//console.debug('%c ********* DETECTING LOCALE ********* ', 'background: #222; color: #bada55');

	let locale = "";
	let lang = "";
	let country = "";
	let langlocale = "";

	// 1. Detect from our hashed url

	if (detect == 'all' || detect == 'hash') {
		if (__validateLangLocale(___detectFromHashURL())) {
			__setCookies();
			return
		}
	}

	// 2. Detect from actual querystring

	if (detect == 'all' || detect == 'querystring') {
		if (__validateLangLocale(___detectFromQuerystring())) {
			__setCookies();
			return
		}
	}

	// 3. Detect from our own campaign cookies

	// if (detect =='all' || detect == 'campaigncookies') {
	//   if ( __validateLangLocale(___detectFromCampaignCookies()) ){
	//     return
	//   }
	// }

	// 4. Detect from Nike.com Cookies 

	if (detect == 'all' || detect == 'dotcomcookies') {
		if (__validateLangLocale(___detectFromDotComCookies())) {
			return
		}
	}

	if (detect == 'all' || detect == 'consumerchoicecookies') {
		if (__validateLangLocale(___detectFromDotComConsumerChoiceCookies())) {
			return
		}
	}



	// By this point we have not detected a language


	//console.debug('%c NO LOCALE DETECTED.', 'background: #ff0000; color: #fff');
	//console.debug('%c Setting to default.', 'background: #f5f5f5; color: #000');

	if (REQUIRE_LANG_TUNNEL || isEvent()) {

		// Redirect to language tunnel

		window.location.replace(__LANG_TUNNEL__);

	} else {

		// Set Defaults

		__setCountry(__default_country__);

		__localeMatchesLang(__default_locale__);

	}

}



function ___detectFromHashURL() {

	// From Hash URL
	// Detect from {url}/#countrycode/locale_locale

	let hash_array = __hashArray();

	//console.debug('%c DETECT HASH', 'background: #b3daff; color: #000; font-weight: bold');

	if (hash_array.length > 1) {

		//console.debug(hash_array[1], LOCALE_LANG[hash_array[1]])

		if (hash_array[0] != 'locale' && LOCALE_LANG[hash_array[1]] != undefined) {

			let locale = hash_array[1];
			let country = hash_array[0];

			//console.debug("Found Locale:", locale);
			//console.debug("Found Country:", country);


			return { locale: locale, country: country }

		} else {

			//console.debug('%c No locale found', 'color: #ccc');

		}

	} else {
		//console.debug('%c No locale found', 'color: #ccc');
	}


	return false;



}




function ___detectFromQuerystring() {
	/* ————————————————————————————————————————————————————————————— */
	// Query String

	let locale = __getParameterByName('locale');

	//console.debug('%c DETECT QUERYSTRING', 'background: #b3daff; color: #000; font-weight: bold');

	if (locale) {
		//console.debug("Found Locale:", locale);
		return { locale: locale }
	} else {
		//console.debug('%c No locale found', 'color: #ccc');
	}

	return false;

}




function ___detectFromCampaignCookies() {

	/* ————————————————————————————————————————————————————————————— */
	// Nike By You Cookies
	// Try our cookies.

	//console.debug('%c DETECT NikeByYou COOKIES', 'background: #b3daff; color: #000; font-weight: bold');

	let locale = __cookie.getItem('NBY_LOCALE');
	let country = __cookie.getItem('NBY_COUNTRY');

	if (locale) {

		//console.debug("Found Locale:", locale);
		//console.debug("Found Country:", country);

		return { locale: locale, country: country }



	} else {
		//console.debug('%c No locale found', 'color: #ccc');
	}

	return false;

}


function ___detectFromDotComCookies() {
	/* ————————————————————————————————————————————————————————————— */
	// .COM Cookies
	// First we check NIKE_COMMERCE_LANG_LOCALE and NIKE_COMMERCE_COUNTRY

	//console.debug('%c DETECT Nike.com COOKIES', 'background: #b3daff; color: #000; ');

	let locale;
	let country;

	locale = __cookie.getItem('NIKE_COMMERCE_LANG_LOCALE');
	country = __cookie.getItem('NIKE_COMMERCE_COUNTRY');

	//console.debug('%c DETECT NIKE_COMMERCE_LANG_LOCALE / NIKE_COMMERCE_COUNTRY COOKIES', 'background: #f5f5f5; color: #000; font-weight: bold');




	if (locale) {
		//console.debug("Found NIKE_COMMERCE_LANG_LOCALE:", locale);
		//console.debug("Found NIKE_COMMERCE_COUNTRY:", country);
		return { locale: locale, country: country }
	} else {
		//console.debug('%c No locale found', 'color: #ccc');
	}


	return false;

}

function ___detectFromDotComConsumerChoiceCookies() {

	// Second let's check CONSUMERCHOICE

	let locale;
	let country;

	let consumerlocale = __cookie.getItem('CONSUMERCHOICE');

	//console.debug('%c DETECT NIKE.COM CONSUMER CHOICE COOKIES', 'background: #f5f5f5; color: #000; ');

	if (consumerlocale) {
		//console.debug("Found CONSUMERCHOICE cookie:", consumerlocale);
		let localePieces = consumerlocale.split('/');
		country = localePieces[0].toUpperCase();
		locale = localePieces[1];
		localePieces = locale.split('_');
		locale = localePieces[0] + '_' + localePieces[1].toUpperCase();
	}

	if (locale) {
		return { locale: locale, country: country }
	} else {
		//console.debug('%c No locale found', 'color: #ccc');
	}

	return false;

}

/* ————————————————————————————————————————————————————————————— */



function __isLocale(loc = "") {
	//console.debug(loc)
	return loc.toLowerCase() == __userLocale().toLowerCase();

}

function __validateLocale(locale) {
	return (LOCALES.indexOf(locale.toLowerCase()) > -1)
}

function __mapLocaleToLang() {

	let locale = __userLocale();
	let lang = false;

	lang = LOCALE_LANG[locale];

	if (lang == undefined) {
		lang = 'en-us';
	}
	return lang;
}


function __loadLocalization(lang, localizationResponse) {

	//console.debug('%c LOAD LOCALIZATION: ' + lang, 'background: #3399ff; color: #fff');
	__LOCALIZED_JSON__ = __ALL_JSON__[lang.toLowerCase()];
	localizationResponse();


	// //console.debug('%c LOAD LOCALIZATION: ' + lang, 'background: #3399ff; color: #fff');
	// let endpoint = LOC_FOLDER + lang + '.json';

	// let xhr = new XMLHttpRequest();
	// xhr.open('GET', endpoint);
	// xhr.onload = function() {
	// 		if (xhr.status === 200) {
	// 				let r = JSON.parse(xhr.responseText);

	// 				__LOCALIZED_JSON__ = r;
	// 				localizationResponse();
	// 		}
	// 		else {
	//       //console.debug('%c ERROR LOADING JSON', 'background: #FF0000; color: #fff');
	// 		}
	// };
	// xhr.send();


}

function _handleLocalizationResponse(response) {
	// do something with our data
}


function __setTestCampaignCookies() {
	__cookie.setItem('NBY_LOCALE', 'en_us', Infinity, '/', '.nike.com', false);
	__cookie.setItem('NBY_COUNTRY', 'us', Infinity, '/', '.nike.com', false);
}

function __clearTestCampaignCookies() {
	__cookie.removeItem('NBY_LOCALE', '/', '.nike.com', false);
	__cookie.removeItem('NBY_COUNTRY', '/', '.nike.com', false);

}




export {
	__loadLocalization,
	__formatTurkish,
	__userLang,
	__userLocale,
	__userCountry,
	__userCountryName,
	__detectLangLocale,
	__getLocalizedStringFromKey,
	__validateLocale,
	__validateLangLocale,
	__isLocale,
	__setDefaultLang,
	__EMEA,
	__setTestCampaignCookies,
	__clearTestCampaignCookies,
	__getUserLocalization,
	__userCommerceByCountry,
	__userRegionByCountry,
	__userCartByCountry,
	__userLaunchByCountry,
	__userSunsetByCountry,
	LOCALES
}

