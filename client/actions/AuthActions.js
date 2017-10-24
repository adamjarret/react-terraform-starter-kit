import request from 'superagent'
import {AUTH_LOGIN, AUTH_LOGIN_OK, AUTH_LOGIN_FAIL, AUTH_LOGOUT} from '~/constants/ActionTypes'
import {endpointPrefix} from '~/constants/Urls'

export function fetchToken(password)
{
    return (dispatch) => {

        dispatch({type: AUTH_LOGIN});

        request
            .post(endpointPrefix + '/api/login')
            .send({ password })
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) {
                    var e;
                    try {
                        e = JSON.parse(err.response.text);
                    }
                    catch(parseError) {
                        e = {message: `Unknown Error (${err.status})`};
                    }
                    dispatch({type: AUTH_LOGIN_FAIL, payload: e});
                } else {
                    dispatch({type: AUTH_LOGIN_OK, payload: res.body.token});
                }
            });

    }
}

export function clearToken()
{
    return {type: AUTH_LOGOUT}
}
