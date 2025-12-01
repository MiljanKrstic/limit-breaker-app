import {
    useState,
    useRef,
    useEffect
} from 'react';

import {
    TextInput,
    View,
    StyleSheet,
    Animated,
    ViewStyle,
    Pressable,
    InputModeOptions
} from 'react-native';

import { Image } from 'expo-image';

const PasswordInput = ({
    style,
    label,
    value,
    onChange,
    onPressOut,
    error,
    errorText,
    inputMode,
    textWhite
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
}) =>
{
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        color: '#8A8A8A',
        fontFamily: 'ChakraPetch-Regular',
    };

    return (
        <View style={{ ...styles.container, ...style }}>
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

            <View
                style={{
                    ...styles.inputWrapper,
                    ...(error ? styles.inputBorderError : textWhite ? styles.inputBorderWhite : styles.inputBorder)
                }}
            >
                <TextInput
                    style={[
                        styles.input,
                        { flex: 1 },
                        (textWhite ? { color: '#FFFFFF' } : {})
                    ]}
                    placeholder=''
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={value}
                    onChangeText={onChange}
                    onPressOut={onPressOut}
                    inputMode={inputMode}
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <View style={styles.toggle}>
                        {showPassword ?
                            <Image
                                source={require('@/assets/images/show-password-icon.png')}
                                style={{ width: 24, height: 24 }}
                            /> :
                            <Image
                                source={require('@/assets/images/hide-password-icon.png')}
                                style={{ width: 24, height: 24 }}
                            />
                        }
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
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
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'ChakraPetch-Regular',
    },
    toggle: {
        paddingHorizontal: 8
    },
});

export default PasswordInput;
