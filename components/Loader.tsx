import { ActivityIndicator, View } from 'react-native';
import Text from '@/components/Text';

const Loader = () =>
{
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000'
        }}>
            <ActivityIndicator
                size={70}
                color="#FFFFFF"
            />
            <Text style={{
                marginTop: 5,
                color: '#FFFFFF',
                fontSize: 18,
                lineHeight: 20
            }}>
                Loading...
            </Text>
        </View>
    )
};

export default Loader;