import {
    GET_VIDEO,
    GET_WATCHLIST,
    VIDEO_ERROR,
    VIDEO_LOADING
} from "../types";


const Reducer = (state: any, action: any) => {

    switch (action.type) {
        case GET_WATCHLIST:
            return {
                ...state,
                watchList: action.payload,
                loading: false
            }
        case GET_VIDEO:
            return {
                ...state,
                currentVideo: action.payload,
                loading: false
            }
        case VIDEO_LOADING: return {
            ...state,
            loading: true
        }
        case VIDEO_ERROR:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};

export default Reducer;
