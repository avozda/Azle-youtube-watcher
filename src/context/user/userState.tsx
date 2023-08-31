import { useReducer, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_LOADING,
  REGISTER,
  IUserState,
  SET_PROFILE_LOADING,
  UPDATE_BALANCE,
  SET_TOKEN_LOADING,
  TOKEN_MINUS,
  SET_ACTOR
} from '../types';
import { useToast } from '@chakra-ui/react';
import { AuthClient } from '@dfinity/auth-client';
import { backend } from '../../declarations/backend';
import { User } from '../../declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/backend';

const isLocalNetwork = process.env.DFX_NETWORK == 'local';
const identityProviderUrl = isLocalNetwork ? `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}` :
  'https://identity.ic0.app/';


type Props = {
  children: ReactNode
}



const UserState = (props: Props) => {
  const initalState: IUserState = {
    user: {},
    loading: true,
    error: null,
    principal: null,
    isAuthenticated: false,
    hasProfile: false,
    profileEditLoading: false,
    sendTokenLoading: false,
    balance: null,
    actor: null
  };
  const toast = useToast();
  const [state, dispatch] = useReducer(UserReducer, initalState);
  const [authClient, setAClient] = useState<undefined | AuthClient>();
  const [actor, setActor] = useState<undefined | any>();
  const dataFetchedRef = useRef(false);

  const init = async () => {
    const aclient = await AuthClient.create()
    setAClient(aclient)
    const isauth = await aclient.isAuthenticated()
    if (isauth) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: aclient.getIdentity().getPrincipal().toString(),
      })

      const identity = aclient.getIdentity();
      const agent = new HttpAgent({ identity })
      const actorA = Actor.createActor(idlFactory, { agent, canisterId: process.env.BACKEND_CANISTER_ID as string })
      await agent.fetchRootKey()

      setActor(actorA);

      dispatch({
        type: SET_ACTOR,
        payload: actorA,
      })
    } else {
      dispatch({ type: LOGOUT });
    }

  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    init();
  }, [])

  useEffect(() => {
    if (authClient && actor) {
      loadUserProfile();
      loadBalance();
    }
  }, [authClient, actor])


  const loadUserProfile = async () => {

    dispatch({ type: SET_LOADING });
    try {
      const profile: any = await actor.loginUser();
      console.log(profile)
      if (profile.Ok) {
        dispatch({
          type: USER_LOADED,
          payload: { ...profile.Ok, hasProfile: true },
        });
        console.log(profile.Ok.id.toString())
      } else {
        dispatch({
          type: USER_LOADED,
          payload: { hasProfile: false },
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

    }
  };

  const sendTokens = async (values: { to: string, amount: number }): Promise<void> => {
    dispatch({ type: SET_TOKEN_LOADING });
    try {
      const res = await actor.icrc1_transfer({
        to: { owner: Principal.fromText(values.to), subaccount: [] },
        amount: BigInt(values.amount),
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: []
      })
      if (res.Err) { throw new Error() } else {
        toast({
          title: "Successfully send",
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        });
      }
      dispatch({ type: TOKEN_MINUS, payload: values.amount });
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
      dispatch({ type: TOKEN_MINUS, payload: 0 });
    }

  };


  const registerProfile = async (formData: User) => {
    dispatch({ type: SET_PROFILE_LOADING });
    try {

      const profile: any = await actor.registerUser({
        nftURL: formData.nftURL,
        about: formData.about,
        username: formData.username,
        twitterLink: formData.twitterLink,
      });

      if (profile.Ok) {
        dispatch({
          type: REGISTER,
          payload: profile.Ok
        });
        toast({
          title: "Successfully saved",
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        });
      } else {
        console.log(profile)
      }

    } catch (error) {
      console.log(error)
    }
  };
  const updateProfile = async (formData: User) => {

    dispatch({ type: SET_PROFILE_LOADING });
    try {
      const profile: any = await actor.updateUser({
        nftURL: formData.nftURL,
        about: formData.about,
        username: formData.username,
        twitterLink: formData.twitterLink,
      });

      if (profile.Ok) {
        dispatch({
          type: REGISTER,
          payload: profile.Ok
        });
        toast({
          title: "Successfully saved",
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        });
      }

    } catch (error) {
      console.log(error)
    }
  };


  const login = async () => {
    await authClient?.login({
      identityProvider: identityProviderUrl,
      onError: err => {
        toast({
          title: err,
          status: 'error',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        });
        dispatch({
          type: AUTH_ERROR,
        });

      },
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        console.log("succ")
        toast({
          title: "You are now logged in",
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
          isClosable: true,
        });
        dispatch({
          type: LOGIN_SUCCESS,
          payload: authClient?.getIdentity().getPrincipal().toString(),
        });
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity })
        const actorA = Actor.createActor(idlFactory, { agent, canisterId: process.env.BACKEND_CANISTER_ID as string })
        await agent.fetchRootKey()
        setActor(actorA);
        dispatch({
          type: SET_ACTOR,
          payload: actorA,
        })
      },
    });
  };

  const logout = () => {
    authClient?.logout();
    toast({
      title: "You are now logged out",
      status: 'success',
      duration: 5000,
      position: 'bottom-right',
      isClosable: true,
    });
    dispatch({ type: LOGOUT });
  };


  const loadBalance = async () => {
    try {
      if (authClient !== undefined) {
        const balance = await backend.icrc1_balance_of({ owner: authClient?.getIdentity().getPrincipal(), subaccount: [] })
        dispatch({
          type: UPDATE_BALANCE,
          payload: balance,
        });

      }
    } catch (error) {

    }
  }

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        principal: state.principal,
        hasProfile: state.hasProfile,
        profileEditLoading: state.profileEditLoading,
        balance: state.balance,
        sendTokenLoading: state.sendTokenLoading,
        login,
        logout,
        loadUserProfile,
        registerProfile,
        updateProfile,
        loadBalance,
        sendTokens,
        actor: state.actor
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
