import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import emotionsAI_logo from './pictures/emotionsAI_logo.png';
import PaidNavbar from './PaidNavbar';
import TranscribeText from './TranscribeText';

Amplify.configure(awsExports);

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
        <Authenticator loginMechanism={['email']} components={components}>
            {({ signOut, user }) => (
                <div>
                    <PaidNavbar logOut={signOut} user={user} />
                    {/* Redirect to TranscribeText after login */}
                    <TranscribeText />
                </div>
            )}
        </Authenticator>
    );

};

export default Login;
