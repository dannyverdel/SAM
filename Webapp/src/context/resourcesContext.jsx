import createDataContext from "./createDataContext";
import api from "../api/api";

const resourcesReducer = (state, action) => {
    switch (action.type) {
        case "add_error":
            return { ...state, errorMessage: action.payload };
        case "get_resources":
            return { ...state, errorMessage: "", resources: action.payload };
        case "get_resource":
            return { ...state, errorMessage: "", resource: action.payload };
        case 'add_resource':
            return { ...state, errorMessage: "", resources: [...state.resources, action.payload] };
        case 'update_resource':
            return { ...state, errorMessage: "", resources: state.resources.map(resource => resource._id === action.payload._id ? action.payload : resource) };
        case "clear_error_message":
            return { ...state, errorMessage: "" };
        default:
            return state;
    }
}

const getResources = (dispatch) => {
    return async (callback) => {
        try {
            const response = await api.get('/api/resources');
            dispatch({ type: 'get_resources', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de resources' });
        }
    }
}

const getResource = (dispatch) => {
    return async (id, callback) => {
        try {
            const response = await api.get(`/api/resources/${id}`);
            dispatch({ type: 'get_resource', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de resource' });
        }
    }
}

const addResource = (dispatch) => {
    return async (resource, callback) => {
        try {
            const response = await api.post('/api/resources', resource);
            dispatch({ type: 'add_resource', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het toevoegen van de resource' });
        }
    }
}

const updateResource = (dispatch) => {
    return async (id, resource, callback) => {
        try {
            const response = await api.put(`/api/resources/${id}`, resource);
            dispatch({ type: 'update_resource', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het updaten van de resource' });
        }
    }
}

const clearErrorMessage = (dispatch) => {
    return () => {
        dispatch({ type: 'clear_error_message' });
    }
}

export const { Provider, Context } = createDataContext(
    resourcesReducer,
    { getResources, getResource, addResource, updateResource, clearErrorMessage },
    { resources: [], resource: {}, errorMessage: "" }
);