import React, { useContext, useEffect } from 'react'
import VideoContext from '../../context/video/videoContext';
import { Spinner, Text, Center, Heading, Box, Stack, Button } from '@chakra-ui/react';
import { watchListVideo } from '../../declarations/backend/backend.did';
import VideoCard from '../../components/videoCard';
const Main = () => {

    const videoContext = useContext(VideoContext);
    const { watchList, currentVideo, getWatchlist, syncVideo, loading } = videoContext;
    useEffect(() => { getWatchlist(); syncVideo(); }, [])

    return (
        <>
            {
                loading ? <Spinner /> :
                    (
                        <>
                            <Center>
                                {currentVideo ?
                                    <iframe width="100%" height="315"
                                        src={`https://www.youtube.com/embed/${currentVideo.Ok.video.videoId}?si=DU0ohwAxNsuKDfbR&amp;start=${Number(currentVideo.Ok.time)}&autoplay=1&mute=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> : "No video being played currently"}
                            </Center>
                            <Box
                                mt={5} ml={10} mr={10}>
                                <Button onClick={() => syncVideo()}>Sync video</Button>
                                <Heading >Watchlist:</Heading>
                                <Stack>
                                    {watchList.map((vid: watchListVideo, i: number) => <><VideoCard proposal={vid} i={i} /></>)}
                                </Stack>

                            </Box>

                        </>
                    )
            }

        </>

    )
}

export default Main