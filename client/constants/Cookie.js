export function parseCookie(cookieHeader, cookieName)
{
    // Thanks http://www.javascripter.net/faq/readingacookie.htm
    var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
    var sMatch = (' '+cookieHeader).match(re);
    return (cookieName && sMatch) ? decodeURIComponent(sMatch[1]) : '';
}

export function clearCookie(cookieName)
{
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}
