import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '@/lib';

import AuthLayout from '@/components/Layouts/AuthLayout';
import AuthHeader from '@/components/AuthHeader';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import PolygonButton from '@/components/PolygonButton';
import TextBold from '@/components/TextBold';

const Login = () =>
{
    const [loading, setLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const [errorForm, setErrorForm] = useState({
        email: {
            message: '',
            error: false
        },
        password: {
            message: '',
            error: false
        }
    });

    const resetForm = () =>
    {
        setLoginForm({
            email: '',
            password: ''
        });

        setErrorForm({
            email: { message: '', error: false },
            password: { message: '', error: false }
        });
    };

    const router = useRouter();

    const loginUser = async () =>
    {
        setLoading(() => true);

        if(!loginForm.email) {
            setErrorForm(prev => ({
                ...prev,
                email: {
                    message: 'The email field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }


        if(!loginForm.password) {
            setErrorForm(prev => ({
                ...prev,
                password: {
                    message: 'The password field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        const { ok, body } = await login(loginForm);
        if(!ok) {
            if(body?.errors?.email) {
                setErrorForm(prev => ({
                    ...prev,
                    email: {
                        message: body?.errors?.email[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.password) {
                setErrorForm(prev => ({
                    ...prev,
                    password: {
                        message: body?.errors?.password[0],
                        error: true
                    }
                }));
            }

            setLoading(() => false);
            return;
        }

        setLoading(() => false);
        resetForm();
        router.navigate('/(tabs)');
    };

    return (
        <AuthLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <AuthHeader
                    redirectButtonText="Register"
                    redirectUrl="/(auth)/register"
                />

                <TextBold style={styles.mainText}>
                    Log in_
                </TextBold>

                <View style={styles.inputContainer}>
                    <Input
                        style={{ marginBottom: 24 }}
                        label='E-MAIL'
                        value={loginForm.email}
                        onChange={value => {
                            setLoginForm(prev => ({
                                ...prev,
                                email: value
                            }));

                            setErrorForm(prev => ({
                                ...prev,
                                email: {
                                    message: '',
                                    error: false
                                }
                            }));
                        }}
                        inputMode='email'
                        error={errorForm.email.error}
                        errorText={errorForm.email.message}
                    />

                    <PasswordInput
                        label='PASSWORD'
                        value={loginForm.password}
                        onChange={value => {
                            setLoginForm(prev => ({
                                ...prev,
                                password: value
                            }));

                            setErrorForm(prev => ({
                                ...prev,
                                password: {
                                    message: '',
                                    error: false
                                }
                            }));
                        }}
                        inputMode='text'
                        error={errorForm.password.error}
                        errorText={errorForm.password.message}
                    />
                </View>

                {/* TODO::should be uncommented when social login is done on back-end side */}
                {/*<Text style={styles.continueWithText}>*/}
                {/*    Or continue with*/}
                {/*</Text>*/}

                {/*<View style={styles.iconContainer}>*/}
                {/*    <TouchableOpacity style={styles.iconButton}>*/}
                {/*        <Image*/}
                {/*            source={require('@/assets/images/app-logo-black.svg')}*/}
                {/*            style={{ width: 24, height: 24 }}*/}
                {/*        />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.iconButton}>*/}
                {/*        <Image*/}
                {/*            source={require('@/assets/images/app-logo-black.svg')}*/}
                {/*            style={{ width: 24, height: 24 }}*/}
                {/*        />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.iconButton}>*/}
                {/*        <Image*/}
                {/*            source={require('@/assets/images/app-logo-black.svg')}*/}
                {/*            style={{ width: 24, height: 24 }}*/}
                {/*        />*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

                <View style={styles.buttonContainer}>
                    <PolygonButton
                        text="continue"
                        onPress={() => loginUser()}
                        loading={loading}
                    />
                </View>
            </ScrollView>
        </AuthLayout>
    )
};

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 40
    },
    inputContainer: {
        marginBottom: 40
    },
    mainText: {
        fontSize: 48,
        lineHeight: 48,
        color: '#232223',
        textAlign: 'center',
        paddingTop: 7,
        marginBottom: 20,
        textTransform: 'uppercase'
    },
    continueWithText: {
        fontWeight: 400,
        fontSize: 18,
        lineHeight: 18,
        color: '#A6A8AB',
        textAlign: 'center',
        marginBottom: 16
    },
    iconButton: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 12px 36px 0px #0000001A',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 40
    }
});

export default Login;