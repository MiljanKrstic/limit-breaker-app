import React, { ReactNode, useRef, useEffect } from 'react';

import {
    StatusBar,
    ScrollView,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    NativeScrollEvent,
    NativeSyntheticEvent
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';

interface AppLayoutProps {
    children: ReactNode
    avoidGlobalPadding?: boolean
    keyboardAvoidingView?: boolean
    pageKey?: string
}

const scrollPositions = new Map<string, { x: number; y: number }>();

const AppLayout = ({
    children,
    avoidGlobalPadding = false,
    keyboardAvoidingView = false,
    pageKey
}: AppLayoutProps) => {
    const scrollViewRef = useRef<ScrollView>(null)

    useEffect(() => {
        if (pageKey) {
            const pos = scrollPositions.get(pageKey)
            if (pos && scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: pos.x, y: pos.y, animated: false })
            }
        }
    }, [pageKey]);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    {
        if (!pageKey) return
        const { contentOffset } = event.nativeEvent
        scrollPositions.set(pageKey, { x: contentOffset.x, y: contentOffset.y })
    };

    const ScrollContent = (
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
        >
            <Header />
            <View style={!avoidGlobalPadding ? { paddingHorizontal: 24 } : undefined}>
                {children}
            </View>
        </ScrollView>
    )

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: '#000000' }}>
                <StatusBar animated barStyle="light-content" />
                {keyboardAvoidingView ? (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, zIndex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            {ScrollContent}
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                ) : (
                    ScrollContent
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default AppLayout;
