import {
    TextInput,
    View,
    StyleSheet,
    Animated,
    ViewStyle,
    InputModeOptions
} from 'react-native';

import {
    useState,
    useRef,
    useEffect
} from 'react';

const Input = ({
    style,
    label,
    value,
    onChange,
    onPressOut,
    error,
    errorText,
    inputMode,
    textWhite,
    disabled
}: {
    style?: ViewStyle,
    label: string,
    value?: string;
    onChange?: (text: string) => void;
    onPressOut?: () => void;
    error?: boolean;
    errorText?: string;
    inputMode: InputModeOptions,
    textWhite?: boolean;
    disabled?: boolean
}) =>
{
    const [isFocused, setIsFocused] = useState(false);

    const labelAnimationRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(labelAnimationRef, {
            toValue: isFocused || value !== '' ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [
        isFocused,
        value,
        labelAnimationRef
    ]);

    const labelStyle = {
        position: 'absolute' as const,
        left: 8,
        top: labelAnimationRef.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -5],
        }),
        fontSize: labelAnimationRef.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 10],
        }),
        fontFamily: 'ChakraPetch-Regular'
    };

    return (
        <View style={{
            ...styles.container,
            ...style
        }}>
            <Animated.Text
                style={{
                    ...labelStyle,
                    ...(error ? { color: '#FF1F1F' } : textWhite ? { color: '#CACACA' } : { color: '#8A8A8A' } ),
                    ...({ width: '80%'})
                }}
                ellipsizeMode='tail'
                numberOfLines={1}
            >
                {label}

                {error && `  ${errorText}`}
            </Animated.Text>

            <TextInput
                style={{
                    ...(styles.input),
                    ...(textWhite ? { color: '#FFFFFF' } : {}),
                    ...(error ? styles.inputBorderError : textWhite ? styles.inputBorderWhite : styles.inputBorder)
                }}
                placeholder=''
                inputMode={inputMode}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChangeText={onChange}
                onPressOut={onPressOut}
                editable={!disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    inputBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#535353',
    },
    inputBorderWhite: {
        borderBottomWidth: 1,
        borderBottomColor: '#535353',
    },
    inputBorderError: {
        borderBottomWidth: 1,
        borderBottomColor: '#FF1F1F',
    },
    input: {
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'ChakraPetch-Regular'
    }
});

export default Input;
