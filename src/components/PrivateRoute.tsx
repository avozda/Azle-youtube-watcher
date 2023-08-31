import React, { ReactNode, useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import UserContext from "../context/user/userContext";
import { Spinner } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
type Props = {
    children: ReactNode
}
const PrivateRoute = ({ children }: Props) => {
    const userContext = useContext(UserContext);
    const { loading, isAuthenticated } = userContext;

    if (loading) {
        return (
            <Center h={"80vh"}>
                <Spinner />
            </Center>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return children;
};

export default PrivateRoute;
