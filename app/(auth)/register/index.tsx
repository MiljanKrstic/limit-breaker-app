import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { register } from '@/lib';
import { Picker } from '@react-native-picker/picker';

import AuthLayout from '@/components/Layouts/AuthLayout';
import AuthHeader from '@/components/AuthHeader';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import PolygonButton from '@/components/PolygonButton';
import TextBold from '@/components/TextBold';
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () =>
{
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [registerForm, setRegisterForm] = useState({
        name: '',
        gender: 'male',
        date_of_birth: new Date(),
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errorForm, setErrorForm] = useState({
        name: {
            message: '',
            error: false
        },
        email: {
            message: '',
            error: false
        },
        password: {
            message: '',
            error: false
        },
        password_confirmation: {
            message: '',
            error: false
        }
    });

    const toggleDatePicker = () => setShowDatePicker(() => !showDatePicker);

    const resetForm = () =>
    {
        setRegisterForm({
            name: '',
            gender: 'male',
            date_of_birth: new Date(),
            email: '',
            password: '',
            password_confirmation: ''
        });

        setErrorForm({
            name: { message: '', error: false },
            email: { message: '', error: false },
            password: { message: '', error: false },
            password_confirmation: { message: '', error: false }
        });

        setShowDatePicker(false);
    };

    const registerUser = async () =>
    {
        setLoading(() => true);

        if(!registerForm.name) {
            setErrorForm(prev => ({
                ...prev,
                name: {
                    message: 'The name field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!registerForm.email) {
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

        if(!registerForm.password) {
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

        if(!registerForm.password_confirmation) {
            setErrorForm(prev => ({
                ...prev,
                password_confirmation: {
                    message: 'The password confirmation field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        const { ok, body } = await register(registerForm);

        if(!ok) {
            if(body?.errors?.name) {
                setErrorForm(prev => ({
                    ...prev,
                    name: {
                        message: body?.errors?.name[0],
                        error: true
                    }
                }));
            }

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

            if(body?.errors?.password_confirmation) {
                setErrorForm(prev => ({
                    ...prev,
                    password_confirmation: {
                        message: body?.errors?.password_confirmation[0],
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
                    redirectButtonText="Log in"
                    redirectUrl="/(auth)/login"
                />

                <TextBold style={styles.mainText}>
                    Register_
                </TextBold>

                <View style={styles.inputContainer}>
                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#535353',
                            marginBottom: 24
                        }}
                    >
                        <Picker
                            mode={'dropdown'}
                            style={{
                                fontSize: 16,
                                fontFamily: 'ChakraPetch-Regular'
                            }}
                            selectedValue={registerForm?.gender}
                            onValueChange={value =>
                                setRegisterForm(prev => ({
                                    ...prev,
                                    gender: value
                                }))
                            }
                        >
                            <Picker.Item
                                style={{
                                    fontSize: 16,
                                    fontFamily: 'ChakraPetch-Regular'
                                }}
                                label='Male'
                                value='male'
                            />

                            <Picker.Item
                                style={{
                                    fontSize: 16,
                                    fontFamily: 'ChakraPetch-Regular'
                                }}
                                label='Female'
                                value='female'
                            />
                        </Picker>
                    </View>

                    <Input
                        style={{ marginBottom: 24 }}
                        label='DATE OF BIRTH'
                        value={
                            registerForm?.date_of_birth
                                ? new Date(registerForm.date_of_birth).toLocaleDateString()
                                : ''
                        }
                        onPressOut={() => toggleDatePicker()}
                        onChange={() => setShowDatePicker(true)}
                        inputMode='text'
                    />

                    {showDatePicker &&
                        <DateTimePicker
                            value={registerForm.date_of_birth}
                            mode='date'
                            display='spinner'
                            onChange={(_, selectedDate) => {
                                if (selectedDate) {
                                    setRegisterForm(prev => ({
                                        ...prev,
                                        date_of_birth: selectedDate
                                    }));
                                }

                                toggleDatePicker();
                            }}
                        />
                    }

                    <Input
                        style={{ marginBottom: 24 }}
                        label='NAME'
                        value={registerForm?.name}
                        onChange={value => {
                            setRegisterForm(prev => ({
                                ...prev,
                                name: value
                            }));

                            setErrorForm(prev => ({
                                ...prev,
                                name: {
                                    message: '',
                                    error: false
                                }
                            }));
                        }}
                        inputMode='text'
                        error={errorForm.name.error}
                        errorText={errorForm.name.message}
                    />

                    <Input
                        style={{ marginBottom: 24 }}
                        label='E-MAIL'
                        value={registerForm?.email}
                        onChange={value => {
                            setRegisterForm(prev => ({
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
                        style={{ marginBottom: 24 }}
                        value={registerForm?.password}
                        onChange={value => {
                            setRegisterForm(prev => ({
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

                    <PasswordInput
                        label='CONFIRM PASSWORD'
                        style={{ marginBottom: 24 }}
                        value={registerForm?.password_confirmation}
                        onChange={value => {
                            setRegisterForm(prev => ({
                                ...prev,
                                password_confirmation: value
                            }));

                            setErrorForm(prev => ({
                                ...prev,
                                password_confirmation: {
                                    message: '',
                                    error: false
                                }
                            }));
                        }}
                        inputMode='text'
                        error={errorForm.password_confirmation.error}
                        errorText={errorForm.password_confirmation.message}
                    />
                </View>

                {/* TODO::should be copied from login when social login is done on back-end side */}

                <View style={styles.buttonContainer}>
                    <PolygonButton
                        text="continue"
                        onPress={() => registerUser()}
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
        marginBottom: 16
    },
    mainText: {
        fontSize: 48,
        lineHeight: 48,
        color: '#232223',
        textAlign: 'center',
        marginBottom: 40,
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
        boxShadow: '0px 12px 36px 0px #0000001A',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 24
    }
});

export default Register;