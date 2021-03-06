'use strict';

const COOKIE_KEY = 'abtesting-unique-id';

const getCookie = (headers, cookieKey) => {
    if (headers.cookie) {
        for (let cookieHeader of headers.cookie) {
            const cookies = cookieHeader.value.split(';');
            for (let cookie of cookies) {
                const [key, val] = cookie.split('=');
                if (key === cookieKey) {
                    return val;
                }
            }
        }
    }
    return null;
}

const setCookie = function (response, cookie) {
    console.log(`Setting cookie ${cookie}`);
    response.headers['set-cookie'] = response.headers['set-cookie'] || [];
    response.headers['set-cookie'] = [{ key: "Set-Cookie", value: cookie }];
}

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const response = event.Records[0].cf.response;

    const cookieVal = getCookie(headers, COOKIE_KEY);
    if (cookieVal != null) {
        setCookie(response, `${COOKIE_KEY}=${cookieVal}`);
        callback(null, response);
        return;
    }

    console.log(`no ${COOKIE_KEY} cookie`);
    callback(null, response);
}