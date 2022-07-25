import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE_POST } from '../constant/actionTypes';

const postReducer = (state = [], action) => {
    switch (action.type) {
        case DELETE:
            return state.filter((post) => post._id !== action.payload)

        case UPDATE:
        case LIKE_POST:

            return state.map((post) => post._id === action.payload._id ? action.payload : post)

        case FETCH_ALL:
            return action.payload

        case CREATE:
            return [...state, action.payload]

        default:
            return state
    }
}

export default postReducer;