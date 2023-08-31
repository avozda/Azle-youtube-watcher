import { Box, Button, Modal, ModalOverlay, FormControl, FormLabel, Input, ModalBody, useDisclosure, ModalContent, ModalFooter, ModalHeader, ModalCloseButton, Spinner } from "@chakra-ui/react"
import { useRef, useState, useContext, useEffect } from "react"
import UserContext from "../context/user/userContext"
export default function SendTokensModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = useRef(null)
    const userContext = useContext(UserContext);
    const { sendTokens, sendTokenLoading } = userContext;

    const [values, setValues] = useState({ to: "", amount: 0 })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setValues(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    return (
        <>
            <Button mr={1} colorScheme="green" onClick={onOpen}>
                Send tokens
            </Button>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Send Tokens</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="to">
                            <FormLabel>Reciever principal</FormLabel>
                            <Input name="to" value={values.to} onChange={handleChange} type="text" />
                        </FormControl>
                        <FormControl mt={2} id="amount">
                            <FormLabel>Amount</FormLabel>
                            <Input name="amount" value={values.amount} onChange={handleChange} type="number" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme="green" isDisabled={sendTokenLoading} onClick={() => sendTokens(values)}>{sendTokenLoading ? <Spinner /> : "Send"}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}