import ky from 'ky';
import {AUTH_LOGIN, AUTH_LOGIN_OK, AUTH_LOGIN_FAIL, AUTH_LOGOUT} from '~/constants/ActionTypes';
import {endpointPrefix} from '~/constants/ClientConfig';

export function fetchToken(password)
{
    return (dispatch) => {

        dispatch({type: AUTH_LOGIN});

        ky
            .post(endpointPrefix + '/api/login', {
                json: {password}
            })
            .json()
            .then((body) => dispatch({
                type: AUTH_LOGIN_OK,
                payload: body.token
            }))
            .catch((e) => dispatch({
                type: AUTH_LOGIN_FAIL,
                payload: e.response.status === 401 ? {message: 'Incorrect password'} : e
            }))
        ;
    };
}

export function clearToken()
{
    return {type: AUTH_LOGOUT};
}
