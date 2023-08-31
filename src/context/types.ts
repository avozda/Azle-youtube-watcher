import { Principal } from '@dfinity/principal';
import { Proposal } from '../declarations/backend/backend.did';
export const SET_LOADING = 'SET_LOADING';
export const SET_PROFILE_LOADING = 'SET_PROFILE_LOADING';
export const SET_TOKEN_LOADING = 'SET_TOKEN_LOADING';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const TOKEN_MINUS = 'TOKEN_MINUS';
export const SET_ACTOR = 'SET_ACTOR';


export const GET_PROPOSALS = 'GET_PROPOSALS';
export const CREATE_PROPOSAL = 'CREATE_PROPOSAL';
export const PROPOSAL_LOADING = 'PROPOSAL_LOADING';
export const PROPOSAL_ERR = 'PROPOSAL_ERR';
export const UPDATE_PROPOSAL = 'UPDATE_PROPOSAL';



export interface IUserState {
    user: {};
    loading: boolean;
    error: null | string;
    isAuthenticated: boolean;
    hasProfile: boolean;
    principal: Principal | null
    profileEditLoading: boolean,
    sendTokenLoading: boolean,
    balance: number | null,
    actor: any
}
export interface IProposalState {
    loading: boolean;
    error: null | string;
    proposals: Proposal[]
}




export interface ICRC1Account {
    owner: Principal;
    subaccount: [] | [Uint8Array | number[]];
}

export interface ICRC1TransferArgs {
    to: ICRC1Account;
    fee: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    from_subaccount: [] | [Uint8Array | number[]];
    created_at_time: [] | [bigint];
    amount: bigint;
}