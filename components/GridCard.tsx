import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import { Image } from 'expo-image';

import TextBold from '@/components/TextBold';
import Text from '@/components/Text';
import PolygonButtonWhiteSmall from "@/components/PolygonButtonWhiteSmall";

const GridCard = ({
    name,
    description,
    onPress,
    children
}: {
    name: string;
    description?: string;
    onPress: () => void;
    children?: React.ReactNode;
}) =>
{
    return (
        <View style={styles.cardContainer}>
            <View style={styles.triangle} />

            <View style={styles.cardInnerContainer}>
                <View style={{ width: '50%' }}>
                    <Image
                        source={require('@/assets/images/card-image-example.png')}
                        style={{ width: '100%', height: 218, objectFit: 'contain' }}
                    />
                </View>

                <View style={styles.cardTextContainer}>
                    <TextBold
                        style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            lineHeight: 16,
                            marginBottom: 16
                        }}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                    >
                        {name}
                    </TextBold>

                    {description &&
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                lineHeight: 16,
                                marginBottom: 16
                            }}
                            fontFamily='CeraCY-Regular'
                            ellipsizeMode='tail'
                            numberOfLines={2}
                        >
                            {description}
                        </Text>
                    }

                    <View>
                        {children}
                    </View>

                    <PolygonButtonWhiteSmall
                        text='Start'
                        onPress={onPress}
                    />
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        position: 'relative',
        padding: 16,
        backgroundColor: '#242424'
    },
    cardInnerContainer: {
        flexDirection: 'row',
        gap: 16
    },
    cardTextContainer: {
        width: '50%',
        marginTop: 24,
        flexDirection: 'column',
        gap: 16,
        paddingRight: 16
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

export default GridCard;
