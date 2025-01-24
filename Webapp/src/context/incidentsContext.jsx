import createDataContext from "./createDataContext";
import api from "../api/api";

const incidentsReducer = (state, action) => {
    switch (action.type) {
        case 'get_incidents':
            return { ...state, errorMessage: '', incidents: action.payload }
        case 'get_incident':
            return { ...state, errorMessage: '', incident: action.payload }
        case 'add_incident':
            return { ...state, errorMessage: '', incidents: [...state.incidents, action.payload] }
        case 'update_incident':
            return { ...state, errorMessage: '', incidents: state.incidents.map(incident => incident._id === action.payload._id ? action.payload : incident) }
        case 'delete_incident':
            return { ...state, errorMessage: '', incidents: state.incidents.filter(incident => incident._id !== action.payload) }
        case 'add_error':
            return { ...state, errorMessage: action.payload }
        case 'clear_error_message':
            return { ...state, errorMessage: '' }
        default:
            return state;
    }
}

const getIncidents = (dispatch) => {
    return async (callback) => {
        try {
            const response = await api.get('/api/incidents');
            dispatch({ type: 'get_incidents', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de incidenten' });
        }
    }
}

const getIncident = (dispatch) => {
    return async (id, callback) => {
        try {
            const response = await api.get(`/api/incidents/${id}`);
            dispatch({ type: 'get_incident', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van het incident' });
        }
    }
}

const addIncident = (dispatch) => {
    return async (incident, callback) => {
        try {
            const response = await api.post('/api/incidents', incident);
            dispatch({ type: 'add_incident', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het toevoegen van het incident' });
        }
    }
}

const updateIncident = (dispatch) => {
    return async (id, incident, callback) => {
        try {
            const response = await api.put(`/api/incidents/${id}`, incident);
            dispatch({ type: 'update_incident', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het updaten van het incident' });
        }
    }
}

const clearErrorMessage = (dispatch) => {
    return () => {
        dispatch({ type: 'clear_error_message' });
    }
}

export const { Provider, Context } = createDataContext(
    incidentsReducer,
    { getIncidents, getIncident, addIncident, updateIncident, clearErrorMessage },
    { incidents: [], incident: null, errorMessage: '' }
);