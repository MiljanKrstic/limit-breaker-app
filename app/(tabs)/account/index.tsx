import TextBold from '@/components/TextBold';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import AppLayout from '@/components/Layouts/AppLayout';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';
import Loader from '@/components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';

import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';
import asyncStorage from '@/lib/asyncStorage';

import { View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const Account = () =>
{
    const authorizedFetch = useAuthorizedFetch();
    const { getUserData } = asyncStorage();

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const logout = async () =>
    {
        setLoading(true);

        const response = await authorizedFetch('POST', 'logout');

        if(response.ok) {
            const { removeBearerToken, removeUserData } = asyncStorage();
            await removeBearerToken();
            await removeUserData();

            router.dismissAll();
            router.navigate('/(auth)/login');
        }

        setLoading(false);
    };

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [updateForm, setUpdateForm] = useState({
        name: '',
        gender: 'male',
        date_of_birth: new Date(),
        email: '',
        password: '',
        password_confirmation: ''
    });

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (hasLoadedRef.current) return;

        hasLoadedRef.current = true;

        const loadUserData = async () => {
            const user = await getUserData();
            if (!user) return;

            setUpdateForm({
                name: user?.name ?? '',
                gender: user?.gender ?? 'male',
                date_of_birth: user?.date_of_birth
                    ? new Date(user?.date_of_birth)
                    : new Date(),
                email: user?.email ?? '',
                password: '',
                password_confirmation: ''
            });
        };

        loadUserData().then();
    }, []);

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

    const updateUser = async () =>
    {
        setLoading(() => true);

        if(!updateForm.name) {
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

        if(!updateForm.email) {
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

        if(!updateForm.password) {
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

        if(!updateForm.password_confirmation) {
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

        const response = await authorizedFetch('PUT', `user/update`, updateForm);
        const body = response?.body;

        if(!response.ok) {
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
    };

    if(loading)
        return <Loader />;

    return (
        <AppLayout keyboardAvoidingView={true}>
            <TextBold
                style={{
                    color: '#FFFFFF',
                    fontSize: 32,
                    lineHeight: 32,
                    textTransform: 'uppercase',
                    marginVertical: 24
                }}
            >
                Settings
            </TextBold>

            <View>
                <Picker
                    style={{
                        fontSize: 16,
                        fontFamily: 'ChakraPetch-Regular'
                    }}
                    selectedValue={updateForm?.gender}
                    onValueChange={value =>
                        setUpdateForm(prev => ({
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

                <Input
                    style={{ marginBottom: 24 }}
                    label='DATE OF BIRTH'
                    value={
                        updateForm?.date_of_birth
                            ? new Date(updateForm.date_of_birth).toLocaleDateString()
                            : ''
                    }
                    onPressOut={() => toggleDatePicker()}
                    onChange={() => setShowDatePicker(true)}
                    inputMode='text'
                    textWhite={true}
                />

                {showDatePicker &&
                    <DateTimePicker
                        value={updateForm.date_of_birth}
                        mode='date'
                        display='spinner'
                        onChange={(_, selectedDate) => {
                            if (selectedDate) {
                                setUpdateForm(prev => ({
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
                    value={updateForm?.name}
                    onChange={value => {
                        setUpdateForm(prev => ({
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
                    textWhite={true}
                />

                <Input
                    style={{ marginBottom: 24 }}
                    label='E-MAIL'
                    value={updateForm?.email}
                    onChange={value => {
                        setUpdateForm(prev => ({
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
                    textWhite={true}
                />

                <PasswordInput
                    label='PASSWORD'
                    style={{ marginBottom: 24 }}
                    value={updateForm?.password}
                    onChange={value => {
                        setUpdateForm(prev => ({
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
                    textWhite={true}
                />

                <PasswordInput
                    label='CONFIRM PASSWORD'
                    style={{ marginBottom: 24 }}
                    value={updateForm?.password_confirmation}
                    onChange={value => {
                        setUpdateForm(prev => ({
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
                    textWhite={true}
                />

                <PolygonButtonCustom
                    text='Update'
                    onPress={() => updateUser()}
                    style={{
                        marginBottom: 24
                    }}
                />

                <PolygonButtonCustom
                    text='Log out'
                    onPress={() => logout()}
                    style={{
                        paddingBottom: 40
                    }}
                />
            </View>
        </AppLayout>
    )
};

export default Account;