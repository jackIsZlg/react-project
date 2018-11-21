import {combineReducers} from 'redux'
// import * as types from "./action"

const userInfo = (state = {}, action) => {
    switch (action.type) {
        case "EDIT_USERINFO":
            return {...state, ...action.data};
        default:
            return state
    }
};

export default combineReducers({
    userInfo
});