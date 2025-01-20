import createDataContext from "./createDataContext";
import api from '../api/api';

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
            localStorage.setItem('token', response.data.token);
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
        const token = localStorage.getItem('token');
        if (token) {
            dispatch({ type: 'signin', payload: token });

            if (callback) {
                callback();
            }
        }
    }
}

const getMe = (dispatch) => {
    return async () => {
        try {
            const response = await api.get('/api/account');
            dispatch({ type: 'get_me', payload: response.data });
        } catch (err) {
            dispatch({ type: 'signout' });
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de gebruiker' });
        }
    }
}

const signOut = (dispatch) => {
    return (callback) => {
        localStorage.removeItem('token');
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
    { signIn, signOut, getMe, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '' }
);