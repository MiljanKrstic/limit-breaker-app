import { ReactNode } from 'react';

import {
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';

const NeutralCard = ({
    children,
    style
}: {
    children: ReactNode;
    style: ViewStyle
}) =>
{
    return (
        <View style={[styles.cardContainer, style]}>
            <View style={styles.triangle} />

            <View style={styles.cardInnerContainer}>
                {children}
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
        flexDirection: 'column',
        gap: 16
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

export default NeutralCard;
