import createDataContext from "./createDataContext";
import api from '../api/api';
import Cookies from 'js-cookie';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        case 'signin':
            return { errorMessage: '', token: action.payload };
        case 'get_me':
            return { ...state, user: action.payload };
        case 'clear_error_message':
            return { ...state, errorMessage: '' };
        case 'signout':
            return { token: null, errorMessage: '' };
        default:
            return state;
    }
}

const signIn = (dispatch) => {
    return async (email, password, callback) => {
        try {
            const response = await api.post('/api/signin', { email, password });
            Cookies.set('token', response.data.token, { expires: 30, secure: true, sameSite: 'strict' });
            dispatch({ type: 'signin', payload: response.data.token });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het inloggen' });
        }
    }
}

const tryLocalSignin = (dispatch) => {
    return (callback) => {
        const token = Cookies.get('token');
        if (token) {
            dispatch({ type: 'signin', payload: token });

            if (callback) {
                callback();
            }
        }
    }
}

const getMe = (dispatch) => {
    return async (callback) => {
        try {
            const response = await api.get('/api/account');
            if (callback) {
                callback(response.data);
            }
            dispatch({ type: 'get_me', payload: response.data });
        } catch (err) {
            dispatch({ type: 'signout' });
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de gebruiker' });
        }
    }
}

const setup2fa = (dispatch) => {
    return async (secret) => {
        try {
            await api.put('/api/setup-2fa', { totpSecret: secret });
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het instellen van 2FA' });
        }
    }
}

const signOut = (dispatch) => {
    return (callback) => {
        Cookies.remove('token');
        dispatch({ type: 'signout' });
        if (callback) {
            callback();
        }
    }
}

const clearErrorMessage = (dispatch) => {
    return () => {
        dispatch({ type: 'clear_error_message' });
    }
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signIn, signOut, getMe, setup2fa, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '' }
);