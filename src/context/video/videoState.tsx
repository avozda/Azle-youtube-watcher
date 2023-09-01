import { useReducer, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import VideoContext from './videoContext';
import VideoReducer from './videoReducer'
import {
    IVideoState,
    VIDEO_ERROR,
    VIDEO_LOADING,
    GET_VIDEO,
    GET_WATCHLIST
} from '../types';
import { useToast } from '@chakra-ui/react';
import { backend } from '../../declarations/backend';


type Props = {
    children: ReactNode
}



const UserState = (props: Props) => {
    const initalState: IVideoState = {
        loading: true,
        error: null,
        watchList: [],
        currentVideo: null
    };
    const toast = useToast();
    const [state, dispatch] = useReducer(VideoReducer, initalState);
    const dataFetchedRef = useRef(false);

    const getWatchlist = async () => {
        try {
            const watchlist = await backend.getWatchList();
            dispatch({
                type: GET_WATCHLIST,
                payload: watchlist
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
                type: VIDEO_ERROR
            })
        }
    }
    const syncVideo = async () => {
        try {
            const video = await backend.getCurrentVideo();

            dispatch({
                type: GET_VIDEO,
                payload: video
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
                type: VIDEO_ERROR
            })
        }
    }



    return (
        <VideoContext.Provider
            value={{
                loading: state.loading,
                error: state.error,
                watchList: state.watchList,
                currentVideo: state.currentVideo,
                getWatchlist,
                syncVideo
            }}
        >
            {props.children}
        </VideoContext.Provider>
    );
};

export default UserState;
