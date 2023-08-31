import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_LOADING,
  REGISTER,
  TOKEN_MINUS,
  SET_TOKEN_LOADING,
  SET_PROFILE_LOADING, UPDATE_BALANCE,
  SET_ACTOR
} from "../types";

const Reducer = (state: any, action: any) => {

  switch (action.type) {
    case SET_ACTOR:
      return {
        ...state,
        actor: action.payload
      }
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        hasProfile: action.payload.hasProfile,
        error: null,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        profileEditLoading: true
      }
    case SET_TOKEN_LOADING:
      return {
        ...state,
        sendTokenLoading: true
      }
    case TOKEN_MINUS:
      return {
        ...state,
        balance: state.balance - action.payload,
        sendTokenLoading: false
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        isAuthenticated: true,
        principal: action.payload
      };
    case REGISTER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        hasProfile: true,
        error: null,
        loading: false,
        profileEditLoading: false
      };
    case UPDATE_BALANCE:

      return {
        ...state,
        balance: Number(action.payload)
      }

    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        principal: null,
        hasProfile: false,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Reducer;
