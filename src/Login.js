import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import emotionsAI_logo from './pictures/emotionsAI_logo.png';
import TranscribeText from './TranscribeText';

Amplify.configure(awsExports);

const theme = {
    name: "Custom Auth Theme",
    tokens: {
        colors: {
        turquoise: {
            60: "#74AA9C", // Custom emotionsai color
        },
        },
        components: {
        authenticator: {
            router: {
            boxShadow: '0 0 16px #74AA9C', // Custom emotionsai color
            borderWidth: "0",
            },
            form: {
            padding:
                "var(--amplify-space-medium) var(--amplify-space-xl) var(--amplify-space-medium)",
            },
        },
        button: {
            primary: {
            backgroundColor: "#74AA9C", // Custom emotionsai color
            },
            link: {
            color: "#74AA9C", // Custom emotionsai color
            },
        },
        fieldcontrol: {
            _focus: {
            boxShadow: '0 0 0 2px #74AA9C', // Custom emotionsai color
            },
        },
        tabs: {
            item: {
            color: "var(--amplify-colors-neutral-80)",
            _active: {
                borderColor: "#74AA9C", // Custom emotionsai color
                color: "#74AA9C", // Custom emotionsai color
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
    };

    return (
        <ThemeProvider theme={theme}>
            <Authenticator loginMechanism={['email']} components={components}>
                {({ signOut, user }) => (
                    <div>
                        <TranscribeText />
                    </div>
                )}
            </Authenticator>
        </ThemeProvider>
    );
    
};

export default Login;
