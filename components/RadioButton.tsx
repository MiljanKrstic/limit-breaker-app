import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';

type Props = {
    isSelected: boolean;
    onPress: () => void;
    text: string;
};

const RadioButton = (props: Props) =>
{
    const { isSelected, text, onPress } = props;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <Text
                style={styles.text}
                fontFamily={'Chakra Petch'}
                ellipsizeMode='tail'
                numberOfLines={2}
            >
                {text}
            </Text>
            <View style={styles.outer}>
                {isSelected && <View style={styles.inner} />}
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        lineHeight: 18,
        textTransform: 'uppercase',
        maxWidth: 250
    },
    outer: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#A6A6A6",
        alignItems: "center",
        justifyContent: "center",
    },
    inner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: "#383838",
    },
});

export default RadioButton;