import { ReactNode } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';

import { Image } from 'expo-image';

interface AuthLayoutProps
{
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) =>
{
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    paddingHorizontal: 24,
                    flex: 1,
                    position: 'relative',
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        zIndex: 1
                    }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        {children}
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                <Image
                    source={require('@/assets/images/auth-frame.png')}
                    style={{
                        width: 159,
                        height: 264,
                        position: 'absolute',
                        right: 24,
                        bottom: 40,
                        zIndex: 0
                    }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

export default AuthLayout;