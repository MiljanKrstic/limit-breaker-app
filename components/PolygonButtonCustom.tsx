import {
    View,
    StyleSheet,
    ViewStyle,
    StyleProp,
    TouchableOpacity
} from 'react-native';

import { ReactNode } from 'react';
import Text from '@/components/Text';

const TRIANGLE_WIDTH = 8;

const PolygonButtonCustom = ({
    text,
    onPress,
    children,
    style,
    cardColor = '#FFFFFF',
    textColor = '#000000',
}: {
    text: string;
    onPress: () => void;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    cardColor?: string;
    textColor?: string;
}) =>
{
    return (
        <TouchableOpacity
            style={[styles.outerContainer, style]}
            activeOpacity={0.98}
            onPress={onPress}
        >
            <View style={styles.innerWrapper}>
                <View style={[styles.wrapperLeft]}>
                    <View style={[styles.head, { borderBottomColor: cardColor }]} />
                    <View style={[styles.body, { backgroundColor: cardColor }]} />
                    <View style={[styles.tail, { borderLeftColor: cardColor }]} />
                </View>

                <View style={[styles.innerContainer, { backgroundColor: cardColor }]}>
                    <Text style={[styles.text, { color: textColor }]}>{text}</Text>
                    {children}
                </View>

                <View style={[styles.wrapperRight]}>
                    <View style={[styles.head, { borderBottomColor: cardColor }]} />
                    <View style={[styles.body, { backgroundColor: cardColor }]} />
                    <View style={[styles.tail, { borderLeftColor: cardColor }]} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const wrapper: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    zIndex: 1,
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerWrapper: {
        position: 'relative',
        width: '96%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: '100%',
        height: 47,
        paddingHorizontal: 29,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        textTransform: 'uppercase',
        position: 'relative',
        top: -3,
    },
    wrapperLeft: {
        ...wrapper,
        left: -TRIANGLE_WIDTH,
        transform: [{ rotate: '180deg' }],
        top: 0,
    },
    wrapperRight: {
        ...wrapper,
        right: -TRIANGLE_WIDTH,
        top: 0,
    },
    head: {
        width: 0,
        height: 0,
        borderLeftWidth: 0,
        borderRightWidth: TRIANGLE_WIDTH,
        borderBottomWidth: TRIANGLE_WIDTH,
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        position: 'relative',
        top: 0.2,
    },
    body: {
        width: TRIANGLE_WIDTH,
        height: 31,
    },
    tail: {
        width: 0,
        height: 0,
        borderLeftWidth: TRIANGLE_WIDTH,
        borderRightWidth: 0,
        borderTopWidth: TRIANGLE_WIDTH,
        borderTopColor: 'transparent',
        transform: [{ rotate: '90deg' }],
        position: 'relative',
        top: -0.2,
    },
});

export default PolygonButtonCustom;
