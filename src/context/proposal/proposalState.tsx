import { useReducer, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import ProposalContext from './proposalContext';
import ProposalReducer from './proposalReducer'
import {
    IProposalState,
    GET_PROPOSALS,
    CREATE_PROPOSAL,
    PROPOSAL_LOADING,
    PROPOSAL_ERR,
    UPDATE_PROPOSAL
} from '../types';
import { useToast } from '@chakra-ui/react';
import { backend } from '../../declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/backend';
import { VoteArgs } from '../../declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';

type Props = {
    children: ReactNode
}



const UserState = (props: Props) => {
    const initalState: IProposalState = {
        loading: true,
        error: null,
        proposals: []
    };
    const toast = useToast();
    const [state, dispatch] = useReducer(ProposalReducer, initalState);
    const dataFetchedRef = useRef(false);

    const getProposals = async () => {
        try {
            const proposals = await backend.getProposals();
            dispatch({
                type: GET_PROPOSALS,
                payload: proposals
            })
        } catch (error) {
            toast({
                title: "Network error",
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
            });
            dispatch({
                type: PROPOSAL_ERR
            })
        }
    }

    const vote = async (args: VoteArgs, actor: any) => {
        dispatch({
            type: PROPOSAL_LOADING
        })
        try {
            const res = await actor.vote(args);
            if (res.Err) {
                toast({
                    title: res.Err,
                    status: 'error',
                    duration: 9000,
                    position: 'bottom-right',
                    isClosable: true,
                });
                dispatch({
                    type: PROPOSAL_ERR
                })
                return
            }
            dispatch({
                type: UPDATE_PROPOSAL,
                payload: res.Ok
            })

        } catch (error) {
            toast({
                title: "Network error",
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
            });
            dispatch({
                type: PROPOSAL_ERR
            })
        }
    }

    const createProposal = async (youtubeLink: string, actor: any) => {
        dispatch({
            type: PROPOSAL_LOADING
        })
        try {
            const proposal = await actor.addProposal(youtubeLink)
            dispatch({
                type: CREATE_PROPOSAL,
                payload: proposal.Ok
            })

            if (proposal.Err) {
                toast({
                    title: proposal.Err,
                    status: 'error',
                    duration: 9000,
                    position: 'bottom-right',
                    isClosable: true,
                });
                dispatch({
                    type: PROPOSAL_ERR
                })
                return;
            }
            if (proposal.Ok) {
                toast({
                    title: "Proposal posted successfully",
                    status: 'success',
                    duration: 9000,
                    position: 'bottom-right',
                    isClosable: true,
                });
            }

        } catch (error: any) {

            toast({
                title: "Network error",
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
            });
            dispatch({
                type: PROPOSAL_ERR
            })

        }
    }
    return (
        <ProposalContext.Provider
            value={{
                loading: state.loading,
                error: state.error,
                proposals: state.proposals,
                getProposals,
                createProposal,
                vote
            }}
        >
            {props.children}
        </ProposalContext.Provider>
    );
};

export default UserState;
