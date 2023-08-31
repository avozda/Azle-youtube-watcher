import { Box, Button, Modal, ModalOverlay, FormControl, FormLabel, Input, ModalBody, useDisclosure, ModalContent, ModalFooter, ModalHeader, ModalCloseButton, Spinner } from "@chakra-ui/react"
import { useRef, useState, useContext, useEffect } from "react"
import ProposalContext from "../context/proposal/proposalContext"
import UserContext from "../context/user/userContext"
export default function SendTokensModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = useRef(null)
    const proposalContext = useContext(ProposalContext);
    const userContext = useContext(UserContext);
    const { actor } = userContext
    const { loading, createProposal } = proposalContext;

    const [values, setValues] = useState({ youtubeLink: "" })

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
            <Button mb={5} colorScheme="green" onClick={onOpen}>
                Create Proposal
            </Button>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Send Tokens</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="youtubeLink">
                            <FormLabel>Youtube link</FormLabel>
                            <Input name="youtubeLink" value={values.youtubeLink} onChange={handleChange} type="text" />
                        </FormControl>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme="green" isDisabled={loading} onClick={() => {
                            createProposal(values.youtubeLink, actor)
                        }}>{loading ? <Spinner /> : "Create"}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}