import { ReactNode } from 'react';

import {
    StatusBar,
    ScrollView,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';

interface AppLayoutProps {
    children: ReactNode;
    avoidGlobalPadding?: boolean;
    keyboardAvoidingView?: boolean;
}

const AppLayout = ({
    children,
    avoidGlobalPadding = false,
    keyboardAvoidingView = false
}: AppLayoutProps) =>
{
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: '#000000'
                }}
            >
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                />

                {keyboardAvoidingView ?
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{
                            zIndex: 1
                        }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                stickyHeaderIndices={[0]}
                            >
                                <Header />

                                <View style={!avoidGlobalPadding && { paddingHorizontal: 24 }}>
                                    {children}
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView> :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        stickyHeaderIndices={[0]}
                    >
                        <Header />

                        <View style={!avoidGlobalPadding && { paddingHorizontal: 24 }}>
                            {children}
                        </View>
                    </ScrollView>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

export default AppLayout;