import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text, ThemeProvider, TextField, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

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

const Login = () => {

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
                        {/* re use default Authenticator.SignUp.FormFields */}
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

    const navigate = useNavigate();

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
                {({ signOut, user }) => {
                    if (user) {
                        navigate('/transcribetext');
                    }
                    return <div></div>; // return empty div or other content if needed
                }}
            </Authenticator>
        </ThemeProvider>
    );
    
};

export default Login;
