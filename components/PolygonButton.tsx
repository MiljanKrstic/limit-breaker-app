import {
    TouchableOpacity,
    View,
    StyleSheet,
    ViewStyle, ActivityIndicator
} from 'react-native';

import { ReactNode } from 'react';
import Text from '@/components/Text';

const PolygonButton = ({
    text,
    onPress,
    children,
    loading
}: {
    text: string;
    onPress: () => void;
    children?: ReactNode;
    loading?: boolean;
}) =>
{
    return (
        <TouchableOpacity
            style={styles.outerContainer}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={styles.wrapperLeft}>
                <View style={styles.head} />
                <View style={styles.body} />
                <View style={styles.tail} />
            </View>

            <View style={styles.innerContainer}>

                {loading ?
                    <ActivityIndicator
                        style={{ position: 'relative', top: -1 }}
                        size={25}
                        color="#FFFFFF"
                    /> :
                    <View>
                        <Text style={styles.text}>
                            {text}
                        </Text>

                        {children}
                    </View>
                }
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
        width: 173,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        backgroundColor: '#000000',
        width: `${100 - 9}%`,
        maxHeight: 47,
        paddingHorizontal: 31,
        paddingVertical: 14,
    },
    text: {
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase',
        position: 'relative',
        top: -3
    },
    wrapperLeft: {
        ...wrapper,
        transform: [{ rotate: '180deg' }],
        left: 0,
        top: -0.2
    },
    wrapperRight: {
        ...wrapper,
        transform: [{ rotate: '360deg' }],
        right: 0.5,
        bottom: -0.3
    },
    head: {
        width: 0,
        height: 0,
        borderLeftWidth: 0,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderRightColor: 'transparent',
        borderBottomColor: '#000000',
        position: 'relative',
        top: 0.2
    },
    body: {
        width: 8,
        height: 32,
        backgroundColor: '#000000',
    },
    tail: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: '#000000',
        borderTopColor: 'transparent',
        transform: [{ rotate: '90deg' }],
        position: 'relative',
        top: -0.2
    },
});

export default PolygonButton;