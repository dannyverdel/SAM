import createDataContext from "./createDataContext";
import api from "../api/api";

const personsReducer = (state, action) => {
    switch (action.type) {
        case "add_error":
            return { ...state, errorMessage: action.payload };
        case "get_persons":
            return { ...state, errorMessage: "", persons: action.payload };
        case "get_person":
            return { ...state, errorMessage: "", person: action.payload };
        case 'add_person':
            return { ...state, errorMessage: "", persons: [...state.persons, action.payload] };
        case 'update_person':
            return { ...state, errorMessage: "", persons: state.persons.map(person => person._id === action.payload._id ? action.payload : person) };
        case "clear_error_message":
            return { ...state, errorMessage: "" };
        default:
            return state;
    }
}

const getPersons = (dispatch) => {
    return async (callback) => {
        try {
            const response = await api.get('/api/persons');
            dispatch({ type: 'get_persons', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de personen' });
        }
    }
}

const getPerson = (dispatch) => {
    return async (id, callback) => {
        try {
            const response = await api.get(`/api/persons/${id}`);
            dispatch({ type: 'get_person', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het ophalen van de persoon' });
        }
    }
}

const addPerson = (dispatch) => {
    return async (person, callback) => {
        try {
            const response = await api.post('/api/persons', person);
            dispatch({ type: 'add_person', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het toevoegen van de persoon' });
        }
    }
}

const updatePerson = (dispatch) => {
    return async (id, person, callback) => {
        try {
            const response = await api.put(`/api/persons/${id}`, person);
            dispatch({ type: 'update_person', payload: response.data });
            if (callback) {
                callback();
            }
        } catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error ?? 'Er is iets fout gegaan bij het bijwerken van de persoon' });
        }
    }
}

const clearErrorMessage = (dispatch) => {
    return () => {
        dispatch({ type: 'clear_error_message' });
    }
}

export const { Provider, Context } = createDataContext(
    personsReducer,
    { getPersons, getPerson, addPerson, updatePerson, clearErrorMessage },
    { errorMessage: "", persons: [], person: null }
)