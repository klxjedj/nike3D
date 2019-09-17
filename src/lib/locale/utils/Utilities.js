
var __isAndroid         = navigator.userAgent.match(/Android/i),
    __isBlackBerry      = navigator.userAgent.match(/BlackBerry/i),
    __isIOS             = navigator.userAgent.match(/iPhone|iPad|iPod/i),
    __isIOSMobile       = navigator.userAgent.match(/iPhone|iPod/i),
    __isOperaMini       = navigator.userAgent.match(/Opera Mini/i),
    __isWindowsMobile   = navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i),
    __isAnyMobile       = (__isAndroid || __isBlackBerry || __isIOSMobile || __isOperaMini || __isWindowsMobile),
    __isIE              = navigator.userAgent.search('MSIE') !== -1,
    __isEdge            = (navigator.appName === 'Netscape') && (navigator.appVersion.indexOf('Edge/12') > -1),
    __isFirefox         = navigator.userAgent.search('Firefox') !== -1,
    __isChrome          = navigator.userAgent.search('Chrome') !== -1,
    __isSafari          = navigator.userAgent.search('Safari') !== -1,
    __isOpera           = navigator.userAgent.toLowerCase().search('op') !== -1,
    __isIE11            = !(window.ActiveXObject) && "ActiveXObject" in window,
    __isWeChat          = __isFromWeiXin();

if(__isChrome && __isSafari) {
  __isSafari = false;
}
if(__isChrome && __isOpera) {
  __isChrome = false;
}

function __isMobileBrowser() {
  return __isAnyMobile;
}


function __isLandscape() {

  // if (window.screen){
    

  //   if (window.screen.orientation == 'landscape-primary' || window.screen.orientation == 'landscape-secondary') {
  //     alert('true')
  //     return true;
  //   }
  

  // }
  
  // return false
  
}

function __isInView(element) {

  const elementTop    = element.getBoundingClientRect().top;
  const elementBottom = element.getBoundingClientRect().bottom;
  const elementLeft   = element.getBoundingClientRect().left;
  const elementRight  = element.getBoundingClientRect().right;

  var inY = elementTop <= 0 && elementBottom >= 0 ||
         elementTop >= 0 && elementBottom <= window.innerHeight ||
         elementTop <= window.innerHeight && elementBottom >= window.innerHeight;
       
  return inY;
}

function __elementPosition(element) {
  return {
    top: element.getBoundingClientRect().top,
    bottom: element.getBoundingClientRect().bottom,
    left: element.getBoundingClientRect().left,
    right: element.getBoundingClientRect().right
  }
}
function __windowScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
}

function __windowHeight() {
  return window.innerHeight;
}

function __windowWidth() {
  return window.innerWidth;
}

function __windowScrollHeight() {
  return window.innerHeight;
}

function __documentHeight() {
  const body = document.body;
  const html = document.documentElement;

  return (Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight));
}

function __height(el) {
  return el.offsetHeight;
}

function __getIOSVersion() {
  return parseFloat(
   ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
   .replace('undefined', '3_2').replace('_', '.').replace('_', '')
    ) || -1;
}

function __getNestedObjects(object) {
  var array = [];

  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;
    var item = object[key];
    array.push(item);
  }
    return array;
}

function __getNestedObjectsInArray(initArray) {
  var array = [];

    for(var i = 0; i < initArray.length; i++){
      for (var key in initArray[i]) {
        if (!initArray[i].hasOwnProperty(key)) continue;
        var item = initArray[i][key];
        array.push(item);
      }
    }
  return array;
}

function __hashLocation() {
  var location = window.location.hash.replace(/^#\/?|\/$/g, '')
  return location;
}

function __hashArray() {
  var location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
  return location;
}


function __hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function __addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!__hasClass(el, className)) el.className += " " + className
}

function __removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (__hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}
function __setBodyClass(className) {
  var body = document.querySelector('body');
  __addClass(body, className);
}
function __getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function _____shuffleArray(array_to_randomize) {
  var array = array_to_randomize
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

function __shuffleArray (cityArray) {
  var i = 0
    , j = 0
    , temp = null

  ////console.debug(cityArray.length)
  for (i = cityArray.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = cityArray[i]
    cityArray[i] = cityArray[j]
    cityArray[j] = temp
    ////console.debug(cityArray)
  }

  return cityArray
}

function __isFromWeiXin() {

    var ua = navigator.userAgent.toLowerCase();

    if (ua.match(/MicroMessenger/i) == "micromessenger") {

        return true;

    }

    return false;

}

export {
  __height,
  __hasClass,
  __addClass,
  __removeClass,
  __windowScrollTop,
  __windowHeight,
  __windowWidth,
  __windowScrollHeight,
  __documentHeight,
  __isInView,
  __getNestedObjects,
  __getNestedObjectsInArray,
  __hashLocation,
  __isAndroid,
  __isBlackBerry,
  __isIOS,
  __isIOSMobile,
  __isOperaMini,
  __isWindowsMobile,
  __isAnyMobile,
  __isMobileBrowser,
  __isIE,
  __isIE11,
  __isEdge,
  __isFirefox,
  __isChrome,
  __isSafari,
  __isOpera ,
  __hashArray ,
  __getParameterByName ,
  __elementPosition,
  __shuffleArray,
  __setBodyClass,
  __isWeChat,
  __isLandscape
  
};
