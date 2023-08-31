import React, { useContext } from 'react'
import { Card, Box, Image, HStack, Stack, Heading, Text, CardBody, CardFooter, Button } from '@chakra-ui/react'
import { Proposal } from '../declarations/backend/backend.did'
import UserContext from '../context/user/userContext'
import ProposalContext from '../context/proposal/proposalContext'
type Props = {
    proposal: Proposal
}

const ProposalCard = (props: Props) => {
    const proposalContext = useContext(ProposalContext);
    const userContext = useContext(UserContext);
    const { actor, hasProfile, isAuthenticated } = userContext
    const { loading, vote } = proposalContext;

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
                src={props.proposal.payload.thumbnailUrl}
                alt='Thumbnail'
            />

            <Stack>
                <CardBody w={"100%"}>
                    <Heading size='md'>{props.proposal.payload.title}</Heading>
                    <HStack>
                        <Text py='2'>
                            By {props.proposal.payload.channelTile}
                        </Text>
                        <Text py='2'>
                            Duration {props.proposal.payload.duration.toString()}s
                        </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"}>
                        <Text py='2'>
                            State - {Object.keys(props.proposal.state).includes("Open") && "Open"}
                            {Object.keys(props.proposal.state).includes("Succeeded") && "Accepted"}
                            {Object.keys(props.proposal.state).includes("Rejected") && "Rejected"}


                        </Text>
                        {Object.keys(props.proposal.state).includes("Open") && hasProfile && isAuthenticated &&
                            <Box>
                                <Text>Add to watchlist?</Text>
                                <Button isDisabled={loading} onClick={() => vote({ proposal_id: props.proposal.id, vote: { Yes: null } }, actor)} mr={5} variant='solid' colorScheme='green'>
                                    Yes {
                                        (props.proposal.votes_yes.amount_e8s + props.proposal.votes_no.amount_e8s) > 0 && (props.proposal.votes_yes.amount_e8s
                                            / (props.proposal.votes_yes.amount_e8s + props.proposal.votes_no.amount_e8s) * 100n).toString() + "%"}
                                </Button>
                                <Button isDisabled={loading} onClick={() => vote({ proposal_id: props.proposal.id, vote: { No: null } }, actor)} variant='solid' colorScheme='red'>
                                    No  {
                                        (props.proposal.votes_no.amount_e8s + props.proposal.votes_no.amount_e8s) > 0 && (props.proposal.votes_yes.amount_e8s
                                            / (props.proposal.votes_yes.amount_e8s + props.proposal.votes_no.amount_e8s) * 100n).toString() + "%"}
                                </Button>
                            </Box>
                        }

                    </HStack>



                </CardBody>



            </Stack>
        </Card>
    )
}

export default ProposalCard