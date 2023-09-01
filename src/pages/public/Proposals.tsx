import React, { useContext, useEffect } from 'react';
import ProposalContext from '../../context/proposal/proposalContext';
import CreateProposalModal from "../../components/CreateProposalModal"
import { Tabs, HStack, TabList, TabPanels, Tab, TabPanel, Box, Text } from '@chakra-ui/react'
import ProposalCard from '../../components/ProposalCard';
import { Proposal } from '../../declarations/backend/backend.did';
import UserContext from '../../context/user/userContext';
const Proposals = () => {
  const proposlaContext = useContext(ProposalContext);
  const { getProposals, proposals } = proposlaContext;
  const userContext = useContext(UserContext);
  const { hasProfile, isAuthenticated } = userContext
  useEffect(() => { getProposals() }, [])
  return <Box m={10}>
    {(hasProfile && isAuthenticated) ? <CreateProposalModal /> : <Text mb={2} > Create profile to vote and add proposals</Text>
    }

    <Tabs variant='soft-rounded' colorScheme='green'>

      <TabList>
        <Tab>Open</Tab>
        <Tab>Accepted</Tab>
        <Tab>Rejected</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box>
            {proposals.map((data: Proposal) => {
              if (Object.keys(data.state).includes("Open")) {
                return <ProposalCard key={data.id.toString()} proposal={data} />
              }
            }
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            {proposals.map((data: Proposal) => {
              if (Object.keys(data.state).includes("Succeeded") || Object.keys(data.state).includes("Accepted")) {
                return <ProposalCard key={data.id.toString()} proposal={data} />
              }
            }
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box>
            {proposals.map((data: Proposal) => {
              if (Object.keys(data.state).includes("Rejected")) {
                return <ProposalCard key={data.id.toString()} proposal={data} />
              }
            }
            )}
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>

  </Box >;
};

export default Proposals;
