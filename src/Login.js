import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text, ThemeProvider, TextField, useAuthenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import emotionsAI_logo from './pictures/emotionsAI_logo.png';

Amplify.configure(awsExports);

const theme = {
    name: "Custom Auth Theme",
    tokens: {
        colors: {
        turquoise: {
            60: "#74AA9C",
        },
        },
        components: {
        authenticator: {
            router: {
            boxShadow: '0 0 16px #74AA9C',
            borderWidth: "0",
            },
            form: {
            padding:
                "var(--amplify-space-medium) var(--amplify-space-xl) var(--amplify-space-medium)",
            },
        },
        button: {
            primary: {
            backgroundColor: "#74AA9C",
            },
            link: {
            color: "#74AA9C",
            },
        },
        fieldcontrol: {
            _focus: {
            boxShadow: '0 0 0 2px #74AA9C',
            },
        },
        tabs: {
            item: {
            color: "var(--amplify-colors-neutral-80)",
            _active: {
                borderColor: "#74AA9C",
                color: "#74AA9C",
            },
            },
        },
        },
    },
};

const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

const RedirectHandler = ({ user }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirect = async () => {
            if (user) {
                try {
                    const session = await fetchAuthSession();
                    const { accessToken, idToken } = session.tokens ?? {};
                    if (accessToken && idToken) {
                        setBearerToken(accessToken.toString());

                        const userId = idToken.payload.sub;
                        const userDetails = await fetchUserDetails(userId);
                        if (userDetails) {
                            const userType = userDetails.userType;
                            if (userType === 'FreeUser') {
                                navigate('/freeusertranscribetext');
                            } else if (userType === 'PaidUser') {
                                navigate('/transcribetext');
                            } else {
                                navigate('/adminpage');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error during redirection:', error);
                }
            }
        };

        handleRedirect();
    }, [user, navigate]);

    return null;
};

const Login = () => {

    // working code for "navigate('/transcribetext');"
    // const navigate = useNavigate();

    const components = {
        Header() {
            const { tokens } = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <Image
                        alt="EmotionsAI Logo"
                        src={emotionsAI_logo}
                    />
                </View>
            );
        },
        Footer() {
            const { tokens } = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <Text color={tokens.colors.neutral[80]}>
                        &copy; 2024 EmotionsAI. All rights reserved.
                    </Text>
                </View>
            );
        },
        SignUp: {
            FormFields() {
                const { validationErrors } = useAuthenticator();

                return (
                    <>
                        {/* re-use default Authenticator.SignUp.FormFields */}
                        <Authenticator.SignUp.FormFields />

                        {/* add custom name field */}
                        <TextField
                            label="Name"
                            placeholder="Enter your name"
                            name="name"
                            errorMessage={validationErrors.name}
                            hasError={!!validationErrors.name}
                            required
                        />
                    </>
                );
            },
        },
    };

    return (
        <ThemeProvider theme={theme}>
            <Authenticator
                loginMechanism={['email']}
                components={components}
                services={{
                    async validateCustomSignUp(formData) {
                        // validation for custom field
                        if (!formData.name) {
                            return {
                                name: 'Name is required',
                            };
                        }
                    },
                    async handleCustomSignUp(formData) {
                        // custom logic to include 'name' in Lambda trigger
                        formData.userAttributes.name = formData.name;
                        return formData;
                    },
                }}
            >
                {/* {({ user }) => {
                    if (user) {
                        navigate('/transcribetext');
                    }
                    return null;
                }} */}
                {({ user }) => <RedirectHandler user={user} />}
            </Authenticator>
        </ThemeProvider>
    );
    
};

export default Login;
