import {
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle
} from 'react-native';

import { ReactNode } from 'react';
import Text from '@/components/Text';

const PolygonButtonWhiteSmall = ({
    text,
    onPress,
    children,
    style
}: {
    text: string;
    onPress: () => void;
    children?: ReactNode;
    style?: ViewStyle
}) =>
{
    return (
        <TouchableOpacity
            style={styles.outerContainer}
            activeOpacity={0.95}
            onPress={onPress}
        >
            <View style={styles.wrapperLeft}>
                <View style={styles.head} />
                <View style={styles.body} />
                <View style={styles.tail} />
            </View>

            <View style={[styles.innerContainer, style]}>
                <Text style={styles.text}>
                    {text}
                </Text>

                {children}
            </View>

            <View style={styles.wrapperRight}>
                <View style={styles.head} />
                <View style={styles.body} />
                <View style={styles.tail} />
            </View>
        </TouchableOpacity>
    )
};

const wrapper: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 1
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        backgroundColor: '#FFFFFF',
        width: `${100 - 6}%`,
        height: 42,
        maxHeight: 42,
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    text: {
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase',
        position: 'relative',
        top: 0
    },
    wrapperLeft: {
        ...wrapper,
        transform: [{ rotate: '180deg' }],
        left: -4,
        top: 0
    },
    wrapperRight: {
        ...wrapper,
        transform: [{ rotate: '360deg' }],
        right: -4,
        bottom: 0
    },
    head: {
        width: 0,
        height: 0,
        borderLeftWidth: 0,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        position: 'relative',
        top: 0.2
    },
    body: {
        width: 8,
        height: 26,
        backgroundColor: '#FFFFFF',
    },
    tail: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: '#FFFFFF',
        borderTopColor: 'transparent',
        transform: [{ rotate: '90deg' }],
        position: 'relative',
        top: -0.2
    },
});

export default PolygonButtonWhiteSmall;