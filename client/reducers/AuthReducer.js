import {AUTH_LOGIN, AUTH_LOGIN_OK, AUTH_LOGIN_FAIL, AUTH_LOGOUT} from '~/constants/ActionTypes'
import {parseCookie, clearCookie} from '~/constants/Cookie'

const cookieName = 'token';

function initialState()
{
    return {
        token: parseCookie(document.cookie, cookieName),
        isLoading: false,
        error: null
    };
}

export default function (state = initialState(), action)
{
    switch(action.type) {

        case AUTH_LOGIN:
            return {
                token: state.token,
                isLoading: true,
                error: null
            };

        case AUTH_LOGIN_OK:
            return {
                token: action.payload,
                isLoading: false,
                error: null
            };

        case AUTH_LOGIN_FAIL:
            return {
                token: state.token,
                isLoading: false,
                error: action.payload
            };

        case AUTH_LOGOUT:
            clearCookie(cookieName);
            return {
                token: '',
                isLoading: false,
                error: null
            };

        default:
            return state;

    }
}
