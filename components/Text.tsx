import {
    Text as ReactNativeText,
    TextStyle,
    TextProps as RNTextProps,
    StyleProp
} from 'react-native';

type Props = RNTextProps & {
    style?: StyleProp<TextStyle>;
    fontFamily?: string;
};

const Text = ({
    style,
    fontFamily,
    ...props
}: Props) => {
    return (
        <ReactNativeText
            style={[{ fontFamily: fontFamily || 'ChakraPetch-Regular' }, style]}
            {...props}
        />
    );
};

export default Text;
