import { StyleSheet, View, ImageBackground, Image, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import TextBold from '@/components/TextBold';
import Text from '@/components/Text';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';

const GridImageCard = ({
    name,
    durationWeeks,
    onPress,
    style
}: {
    name: string;
    durationWeeks: string;
    onPress: () => void;
    style?: ViewStyle;
}) =>
{
    return (
        <ImageBackground
            style={[styles.cardContainer, style]}
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
        paddingHorizontal: 12,
        paddingBottom: 12
    },
    cardContainer: {
        height: 288,
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

export default GridImageCard;

