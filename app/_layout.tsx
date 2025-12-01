import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';

import Loader from '@/components/Loader';
import asyncStorage from '@/lib/asyncStorage';

const RootLayout = () =>
{
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [nextRoute, setNextRoute] = useState<any | null>(null);

    const router = useRouter();

    useFonts({
        'ChakraPetch-Regular': require('@/assets/fonts/ChakraPetch-Regular.ttf'),
        'ChakraPetch-Bold': require('@/assets/fonts/ChakraPetch-Bold.ttf')
    });

    const { getBearerToken } = asyncStorage();

    useEffect(() => {
        const checkLogin = async () =>
        {
            const token = await getBearerToken();
            const loggedIn = !!token;

            setIsLoggedIn(loggedIn);
            setNextRoute(loggedIn ? '/(tabs)' : '/(auth)/login');
        };

        checkLogin().then();
    }, [getBearerToken]);

    useEffect(() => {
        if (nextRoute) {
            router.push(nextRoute);
        }
    }, [
        nextRoute,
        router
    ]);

    if (isLoggedIn === null)
        return <Loader />;

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            {!isLoggedIn ? (
                <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
            )}
        </Stack>
    );
};

export default RootLayout;
