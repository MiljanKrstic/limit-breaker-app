import {
    View,
    TouchableOpacity
} from 'react-native';

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import Text from '@/components/Text';

const AuthHeader = ({
    redirectButtonText,
    redirectUrl
}: {
    redirectButtonText: string
    redirectUrl: Href
}) =>
{
    const router = useRouter();
    const redirect = () => router.push(redirectUrl);

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 31
            }}
        >
            <View style={{ width: '40%' }}></View>

            <View style={{ width: '10%' }}>
                <Image
                    source={require('@/assets/images/splash-icon-dark.png')}
                    style={{ width: 30, height: 26 }}
                />
            </View>

            <View style={{ width: '40%', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'flex-end'
                    }}
                    onPress={redirect}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 400,
                            textDecorationLine: 'underline',
                            color: '#767676'
                        }}
                    >
                        {redirectButtonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AuthHeader;