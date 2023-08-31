import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { ChakraProvider } from '@chakra-ui/react'
import UserState from "./context/user/userState";
import ProposalState from "./context/proposal/proposalState"
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <React.StrictMode>
      <UserState>
        <ProposalState>
          <App />
        </ProposalState>
      </UserState>

    </React.StrictMode>
  </ChakraProvider >
  ,
);
