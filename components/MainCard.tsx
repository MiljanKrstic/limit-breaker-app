import { StyleSheet, View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TextBold from '@/components/TextBold';
import Text from '@/components/Text';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';

const MainCard = ({
    name,
    description,
    onPress
}: {
    name: string;
    description: string;
    onPress: () => void;
}) =>
{
    return (
        <ImageBackground
            style={styles.cardContainer}
            resizeMode='cover'
            source={require('@/assets/images/card-image-example.png')}
        >
            <LinearGradient
                colors={[
                    'rgba(52, 52, 52, 0.8)',
                    'rgba(52, 52, 52, 0)',
                    'rgba(52, 52, 52, 0)',
                    'rgba(52, 52, 52, 0.4)',
                    'rgba(52, 52, 52, 0.4)',
                    'rgba(52, 52, 52, 0.8)',
                ]}
                locations={[0, 0.2201, 0.4279, 0.5721, 0.8269, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.triangle} />

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end'
                    }}
                >
                    <TextBold
                        style={{
                            color: '#FFFFFF',
                            marginBottom: 16,
                            fontSize: 16,
                            lineHeight: 16,
                            textTransform: 'uppercase'
                        }}
                    >
                        {name}
                    </TextBold>

                    <Text
                        style={{
                            color: '#FFFFFF',
                            marginBottom: 32,
                            fontSize: 16,
                            lineHeight: 17
                        }}
                        fontFamily='CeraCY-Regular'
                    >
                        {description}
                    </Text>

                    <PolygonButtonCustom
                        text='Start'
                        onPress={onPress}
                    />
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 24,
        paddingBottom: 24
    },
    cardContainer: {
        height: 429,
        width: '100%',
        position: 'relative',
        marginRight: 16
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 40,
        borderRightWidth: 40,
        borderBottomWidth: 40,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#000000',
        position: 'absolute',
        top: -20,
        right: -26,
        transform: [{ rotate: '45deg' }],
    },
});

export default MainCard;
