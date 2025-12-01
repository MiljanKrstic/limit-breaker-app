import {
    Text,
    TextProps,
    TextStyle
} from 'react-native';

type Props = TextProps & {
    style?: TextStyle;
    fontFamily?: string;
};

const TextBold = ({
    style,
    fontFamily,
    ...props
}: Props) =>
{
    return (
        <Text
            style={[{ fontFamily: fontFamily ? fontFamily : 'ChakraPetch-Bold' }, style]}
            {...props}
        />
    );
};

export default TextBold;
