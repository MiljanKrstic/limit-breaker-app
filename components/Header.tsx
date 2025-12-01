import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RouteProp, useRoute } from '@react-navigation/native';

import asyncStorage from '@/lib/asyncStorage';

type WorkoutRouteParams = {
    Workout: {
        id: string;
        exercise_id?: string;
        page_type?: 'workout' | 'exercises' | 'exercise';
    };
};

const Header = () =>
{
    const { getCategoryId } = asyncStorage();
    const route = useRoute<RouteProp<WorkoutRouteParams, 'Workout'>>();
    const router = useRouter();

    const id = route.params?.id;
    const page_type = route.params?.page_type;

    const goBack = async () =>
    {
        if (!id || !page_type) {
            router.back()
            return;
        }

        if (page_type === 'exercise') {
            router.push(`/workout/${id}?page_type=exercises`);
        } else if (page_type === 'exercises') {

            const categoryId = await getCategoryId();
            if(!categoryId) router.back();

            router.push(`/workout/${categoryId}?page_type=workout`);
        } else {
            router.back();
        }
    };

    const showBack = !!page_type;

    return (
        <BlurView
            tint="systemChromeMaterialDark"
            intensity={60}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 23,
                paddingHorizontal: 30,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: showBack ? 'space-between' : 'center',
                    width: showBack ? '55%' : '100%',
                }}
            >
                {showBack && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={goBack}
                        style={{ width: 20, height: 20 }}
                    >
                        <Image
                            source={require('@/assets/images/back-icon.png')}
                            style={{ width: 9, height: 16 }}
                        />
                    </TouchableOpacity>
                )}

                <Image
                    source={require('@/assets/images/splash-icon.png')}
                    style={{ width: 30, height: 26 }}
                />
            </View>
        </BlurView>
    );
};

export default Header;
