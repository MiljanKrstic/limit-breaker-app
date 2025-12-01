import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
    StyleSheet,
    View,
    ImageBackground
} from 'react-native';

import TextBold from "@/components/TextBold";
import Text from "@/components/Text";
import PolygonButtonWhiteSmall from '@/components/PolygonButtonWhiteSmall';

const GridImageCard = ({
    name,
    durationWeeks,
    onPress
}: {
    name: string;
    durationWeeks: string;
    onPress: () => void;
}) =>
{
    return (
        <ImageBackground
            style={styles.cardContainer}
            resizeMode="cover"
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
                            fontSize: 16,
                            lineHeight: 16,
                            textTransform: 'uppercase',
                            ...(durationWeeks ? { marginBottom: 8 } : { marginBottom: 27 })
                        }}
                    >
                        {name}
                    </TextBold>

                    {durationWeeks && (
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 8,
                                alignItems: 'center',
                                marginBottom: 27
                            }}
                        >
                            <Image
                                source={require('@/assets/images/calendar.png')}
                                style={{ width: 18, height: 19 }}
                            />

                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    lineHeight: 16
                                }}
                                fontFamily='CeraCY-Regular'
                            >
                                {durationWeeks} weeks
                            </Text>
                        </View>
                    )}

                    <PolygonButtonWhiteSmall
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
        paddingHorizontal: 16,
        paddingBottom: 16
    },
    cardContainer: {
        height: 288,
        width: 160,
        position: 'relative'
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#000000',
        position: 'absolute',
        top: -4,
        right: -14,
        transform: [{ rotate: '45deg' }],
    },
});

export default GridImageCard;
