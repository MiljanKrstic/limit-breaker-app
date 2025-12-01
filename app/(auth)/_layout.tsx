import { Tabs } from 'expo-router';

const _Layout = () =>
{
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    display: 'none'
                }
            }}
        >
            <Tabs.Screen
                name="login/index"
                options={{
                    title: 'Login',
                    headerShown: false
                }}
            />

            <Tabs.Screen
                name="register/index"
                options={{
                    title: 'Register',
                    headerShown: false
                }}
            />
        </Tabs>
    )
};

export default _Layout;