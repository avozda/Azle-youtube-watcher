import {
    GET_PROPOSALS,
    CREATE_PROPOSAL,
    PROPOSAL_LOADING,
    PROPOSAL_ERR,
    UPDATE_PROPOSAL
} from "../types";
import { Proposal } from "../../declarations/backend/backend.did";

const Reducer = (state: any, action: any) => {

    switch (action.type) {
        case GET_PROPOSALS:
            return {
                ...state,
                loading: false,
                error: null,
                proposals: action.payload
            }
        case CREATE_PROPOSAL:
            return {
                ...state,
                loading: false,
                error: null,
                proposals: [...state.proposals, action.payload]
            }

        case UPDATE_PROPOSAL:
            return {
                ...state,
                loading: false,
                proposals: state.proposals.map((prop: Proposal) => prop.id == action.payload.id ? action.payload : prop)
            }
        case PROPOSAL_LOADING: return {
            ...state,
            loading: true
        }
        case PROPOSAL_ERR:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};

export default Reducer;
