import { useContext } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
    Textarea,
    Spinner
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import UserContext from '../../context/user/userContext';
import { Formik, Field } from "formik";
import { Link as RouterLink } from 'react-router-dom';

export default function UserProfileEdit() {

    const userContext = useContext(UserContext);
    const { user, registerProfile, loading, profileEditLoading, hasProfile, updateProfile } = userContext;
    return (
        loading ? <Center h={"100vh"}><Spinner /> </Center> : <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                    User Profile Edit
                </Heading>
                <Formik
                    initialValues={user ? {
                        nftURL: user.nftURL,
                        about: user.about,
                        username: user.username,
                        twitterLink: user.twitterLink
                    } : {
                        nftURL: "",
                        about: "",
                        username: "",
                        twitterLink: ""
                    }}
                    onSubmit={(values) => {
                        if (!values.about) { values.about = "" }
                        if (!values.twitterLink) { values.twitterLink = "" }
                        if (!values.nftURL) { values.nftURL = "" }
                        console.log(hasProfile)
                        hasProfile ? updateProfile(values) : registerProfile(values)
                    }}
                >
                    {({ handleSubmit, errors, touched, values, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <FormControl id="userName">
                                <Stack direction={['column', 'row']} spacing={6}>
                                    <Center w={"full"}>
                                        <Avatar size="xl" src={values.nftURL}>
                                            <AvatarBadge
                                                as={IconButton}
                                                size="sm"
                                                rounded="full"
                                                top="-10px"
                                                colorScheme="red"
                                                aria-label="remove Image"
                                                icon={<SmallCloseIcon onClick={() => setFieldValue("nftURL", "")} />}
                                            />
                                        </Avatar>
                                    </Center>
                                </Stack>
                            </FormControl>
                            <FormControl id="nftURL" mb={2} mt={1}>
                                <FormLabel>Profile picture url</FormLabel>
                                <Field as={Input} id="nftURL" name="nftURL" type="text" placeholder="Image URL" />
                            </FormControl>
                            <FormControl id="username" mb={2} isRequired>
                                <FormLabel>Username</FormLabel>
                                <Field as={Input} id="username" name="username" type="text" placeholder="Username" />
                            </FormControl>
                            <FormControl id="twitterLink" mb={2}>
                                <FormLabel>Your twitter</FormLabel>
                                <Field as={Input} id="twitterLink" name="twitterLink" type="text" placeholder="Twitter URL" />
                            </FormControl>
                            <FormControl id="about" mb={2}>
                                <FormLabel>About</FormLabel>
                                <Field as={Textarea} id="about" name="about" placeholder="Something about you" />
                            </FormControl>

                            <Stack spacing={6} direction={['column', 'row']}>
                                <RouterLink to="/">
                                    <Button
                                        bg={'red.400'}
                                        color={'white'}
                                        w="full"
                                        _hover={{
                                            bg: 'red.500',
                                        }}>
                                        Back
                                    </Button>
                                </RouterLink>
                                <Button
                                    type='submit'
                                    bg={'blue.400'}
                                    color={'white'}
                                    w="full"
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    {profileEditLoading ? <Spinner /> : "Save"}

                                </Button>
                            </Stack>
                        </form>
                    )}
                </Formik>

            </Stack>
        </Flex>


    )
}