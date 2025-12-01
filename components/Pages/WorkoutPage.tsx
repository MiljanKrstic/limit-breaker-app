import {
    StyleSheet,
    View
} from 'react-native';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import AppLayout from '@/components/Layouts/AppLayout';
import Text from '@/components/Text';
import TextBold from '@/components/TextBold';
import GridCard from '@/components/GridCard';
import Loader from '@/components/Loader';
import WeekActivityCalendar from '@/components/WeekActivityCalendar';

import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';
import {Image} from "expo-image";

const WorkoutPage = ({
    id
}: {
    id: string
}) =>
{
    const router = useRouter();
    const authorizedFetch = useAuthorizedFetch();

    const [workout, setWorkout] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () =>
    {
        setLoading(() => true);

        if(!id) {
            setLoading(() => false);
            return;
        }

        const response = await authorizedFetch('GET', `workouts/by-protocol?workout_type_id=${id}`);
        if(response.ok) setWorkout(() => response.body);
        setLoading(() => false);
    };

    useEffect(() => {
        fetchData().then();
    }, [id]);

    if(loading)
        return <Loader />;

    return (
        <AppLayout>
            <View style={{ marginBottom: 24 }}>
                <TextBold style={styles.textBoldMain}>
                    {workout?.workout_type?.name}_
                </TextBold>

                <Text
                    style={styles.textNormalMain}
                    fontFamily='CeraCY-Regular'
                >
                    Your consistent, go-to training path for maintaining energy, strength, and daily performance.
                </Text>

                <WeekActivityCalendar />
            </View>

            <View style={{
                flexDirection: 'column',
                gap: 16,
                marginBottom: 24
            }}>
                {!workout?.workout_type?.workouts?.length ? (
                    <Text
                        style={{
                            color: '#FFFFFF',
                            paddingVertical: 24,
                            textAlign: 'center'
                        }}
                        fontFamily="CeraCY-Regular"
                    >
                        No workouts.
                    </Text>
                ) : (
                    workout?.workout_type?.workouts.map((workout: any) =>
                        <GridCard
                            key={workout?.id}
                            name={workout?.name}
                            onPress={() => {
                                router.push(`/workout/${workout?.id}?page_type=exercises`);
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    marginBottom: 16
                                }}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {workout?.exercises?.map((exercise: any) => exercise?.name).join(', ')}
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/barbell-icon.png')}
                                    style={{ width: 24, height: 15 }}
                                />

                                <Text style={{ color: '#FFFFFF' }}>
                                    {workout?.exercises?.length ?? 0} exercises
                                </Text>
                            </View>
                        </GridCard>
                    )
                )}
            </View>
        </AppLayout>
    )
};

const styles = StyleSheet.create({
    textBoldMain: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontSize: 32,
        lineHeight: 32,
        marginBottom: 16
    },
    textNormalMain: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 17,
        marginBottom: 32,
        width: '95%',
    },
});

export default WorkoutPage;