import TextBold from '@/components/TextBold';
import Input from '@/components/Input';
import PasswordInput from '@/components/PasswordInput';
import AppLayout from '@/components/Layouts/AppLayout';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';

import { View} from 'react-native';

const Account = () =>
{
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

            <View
                style={{
                    marginTop: 24
                }}
            >
                <Input
                    textWhite={true}
                    style={{ marginBottom: 24 }}
                    label='YOUR EMAIL'
                    value={''}
                    onChange={value => {
                        // setLoginForm(prev => ({
                        //     ...prev,
                        //     email: value
                        // }));
                        //
                        // setErrorForm(prev => ({
                        //     ...prev,
                        //     email: {
                        //         message: '',
                        //         error: false
                        //     }
                        // }));
                    }}
                    inputMode='email'
                    // error={errorForm.email.error}
                    // errorText={errorForm.email.message}
                />

                <PasswordInput
                    textWhite={true}
                    style={{ marginBottom: 24 }}
                    label='CHANGE YOUR PASSWORD'
                    value={''}
                    onChange={value => {
                        // setLoginForm(prev => ({
                        //     ...prev,
                        //     password: value
                        // }));
                        //
                        // setErrorForm(prev => ({
                        //     ...prev,
                        //     password: {
                        //         message: '',
                        //         error: false
                        //     }
                        // }));
                    }}
                    inputMode='text'
                    // error={errorForm.password.error}
                    // errorText={errorForm.password.message}
                />

                <Input
                    textWhite={true}
                    style={{ marginBottom: 24 }}
                    label='YOUR SEX'
                    value={''}
                    onChange={value => {
                        // setLoginForm(prev => ({
                        //     ...prev,
                        //     email: value
                        // }));
                        //
                        // setErrorForm(prev => ({
                        //     ...prev,
                        //     email: {
                        //         message: '',
                        //         error: false
                        //     }
                        // }));
                    }}
                    inputMode='email'
                    // error={errorForm.email.error}
                    // errorText={errorForm.email.message}
                />

                <Input
                    textWhite={true}
                    style={{ marginBottom: 24 }}
                    label='YOUR AGE'
                    value={''}
                    onChange={value => {
                        // setLoginForm(prev => ({
                        //     ...prev,
                        //     email: value
                        // }));
                        //
                        // setErrorForm(prev => ({
                        //     ...prev,
                        //     email: {
                        //         message: '',
                        //         error: false
                        //     }
                        // }));
                    }}
                    inputMode='email'
                    // error={errorForm.email.error}
                    // errorText={errorForm.email.message}
                />

                <PolygonButtonCustom
                    text='Submit'
                    onPress={() => {}}
                    style={{
                        marginBottom: 24
                    }}
                />
            </View>
        </AppLayout>
    )
};

export default Account;