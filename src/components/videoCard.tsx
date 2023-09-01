import React, { useContext, useEffect } from 'react'
import { Card, Box, Image, HStack, Stack, Heading, Text, CardBody, CardFooter, Button, Badge } from '@chakra-ui/react'
import { watchListVideo } from '../declarations/backend/backend.did'
type Props = {
    proposal: watchListVideo,
    i: number
}

const VideoCard = (props: Props) => {
    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            mt={2}
            w={"100%"}
        >
            <Image
                objectFit='cover'
                h={"100%"}
                src={props.proposal.thumbnailUrl}
                alt='Thumbnail'
            />

            <Stack>
                <CardBody w={"100%"}>
                    <Stack flexDirection={"row"}>
                        <Heading size='md'>{props.proposal.title}</Heading>
                        {props.i == 0 && <Badge colorScheme='red'> Now playing</Badge>}
                    </Stack>
                    <HStack>
                        <Text py='2'>
                            By {props.proposal.channelTile}
                        </Text>
                        <Text py='2'>
                            Duration {props.proposal.duration.toString()}s
                        </Text>
                    </HStack>

                </CardBody>



            </Stack >
        </Card >
    )
}

export default VideoCard