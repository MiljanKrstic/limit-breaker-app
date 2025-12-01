import { View } from 'react-native';
import { Image, ImageStyle } from 'expo-image';

const TabBarIcon = ({
    focused,
    icon,
    iconStyles
}: {
    focused: boolean,
    icon: { focused: string, default: string },
    iconStyles: ImageStyle
}) =>
{
    return (
        <View
            style={{
                position: 'relative',
                width: '80%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                top: -6
            }}
        >
            {focused &&
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: '#FFFFFF',
                        height: 2,
                        width: '100%'
                    }}
                ></View>
            }

            <Image
                source={focused ? icon.focused : icon.default}
                style={{ ...iconStyles, marginTop: 18 }}
            />
        </View>
    )
};

export default TabBarIcon;