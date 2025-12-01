import { Tabs } from 'expo-router';
import TabBarIcon from '@/components/TabBarIcon';

const _Layout = () =>
{
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingHorizontal: 30,
                    backgroundColor: '#000000',
                    borderTopWidth: 1,
                    borderColor: '#FFFFFF80',
                    alignContent: 'flex-start'
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            focused={focused}
                            icon={{
                                default: require('@/assets/images/home-icon.svg'),
                                focused: require('@/assets/images/home-icon-focused.svg')
                            }}
                            iconStyles={{
                                width: 18,
                                height: 18
                            }}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="workout/[id]"
                options={{
                    title: 'Workout',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            focused={focused}
                            icon={{
                                default: require('@/assets/images/workout-icon.svg'),
                                focused: require('@/assets/images/workout-icon-focused.svg')
                            }}
                            iconStyles={{
                                width: 28,
                                height: 28
                            }}
                        />
                    )
                }}
                listeners={({ navigation }) => ({
                    tabPress: (event) =>
                    {
                        const state = navigation.getState();
                        const workoutRoute = state.routes.find((route: any) => route?.name === 'workout/[id]');
                        const id = workoutRoute?.params?.id ?? null;

                        if(!id) event.preventDefault();
                    },
                })}
            />

            <Tabs.Screen
                name="account/index"
                options={{
                    title: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                            focused={focused}
                            icon={{
                                default: require('@/assets/images/account-icon.svg'),
                                focused: require('@/assets/images/account-icon-focused.svg')
                            }}
                            iconStyles={{
                                width: 18,
                                height: 18
                            }}
                        />
                    )
                }}
            />
        </Tabs>
    )
};

export default _Layout;