import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import { useRouter } from 'expo-router';

import AppLayout from '@/components/Layouts/AppLayout';
import MainCard from '@/components/MainCard';
import GridImageCard from '@/components/GridImageCard';
import TextBold from '@/components/TextBold';
import Text from '@/components/Text';
import Loader from '@/components/Loader';

import { useState, useEffect, useCallback } from 'react';

import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';

const Index = () =>
{
    const [loading, setIsLoading] = useState<boolean>(false);
    const [dailyFitness, setDailyFitness] = useState<any>(null);
    const [dailyCrossFit, setDailyCrossFit] = useState<any>(null);
    const [missingActivityExercise, setMissingActivityExercise] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryWorkouts, setCategoryWorkouts] = useState<any[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const router = useRouter();

    const setSelectedCategoryWorkouts = useCallback((selectedCategoryId: number) => {
        setSelectedCategoryId(selectedCategoryId);
        const category: any = categories.find((category: any) => category?.id === selectedCategoryId);
        setCategoryWorkouts(() => category?.workout_types ?? []);
    }, [categories]);

    const setAllCategoryWorkouts = useCallback((categoriesList: any[]) => {
        const allWorkouts = categoriesList.flatMap((category: any) => category?.workout_types ?? []);
        setCategoryWorkouts(allWorkouts);
        setSelectedCategoryId(null);
    }, []);

    const authorizedFetch = useAuthorizedFetch();

    const fetchData = async () =>
    {
        setIsLoading(() => true);

        const [
            dailyFitnessResponse,
            dailyCrossfitResponse,
            categoriesResponse,
            missingActivityResponse
        ] = await Promise.all([
            authorizedFetch('GET', 'workouts/ultimate-daily-fitness'),
            authorizedFetch('GET', 'workouts/ultimate-daily-cross-fit'),
            authorizedFetch('GET', 'categories'),
            authorizedFetch('GET', 'workouts/missing-activity-workout')
        ]);

        setIsLoading(() => false);

        if (dailyFitnessResponse.ok) setDailyFitness(() => dailyFitnessResponse.body?.workout ?? null);
        if (dailyCrossfitResponse.ok) setDailyCrossFit(() => dailyCrossfitResponse.body?.workout ?? null);
        if (categoriesResponse.ok) {
            const fetchedCategories = categoriesResponse.body?.categories ?? [];
            setCategories(() => fetchedCategories);
            setAllCategoryWorkouts(fetchedCategories);
        }

        console.log(missingActivityResponse)
        if(missingActivityResponse.ok) {
            setMissingActivityExercise(() => missingActivityResponse.body?.workout ?? null);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    if(loading)
        return <Loader />;

    return (
        <AppLayout>
            <View style={{ marginBottom: 28 }}>
                <TextBold style={styles.textBoldMain}>
                    Routines_
                </TextBold>

                <Text
                    style={styles.textNormalMain}
                    fontFamily='CeraCY-Regular'
                >
                    Daily workouts crafted to keep your body moving and your fitness progressing with ease and rhythm.
                </Text>
            </View>

            <View style={styles.textContainer}>
                <TextBold style={styles.textBoldInner}>
                    Ultimate Daily
                </TextBold>
            </View>

            {!dailyFitness ?
                <Text
                    style={{
                        color: '#FFFFFF',
                        paddingVertical: 24,
                        marginBottom: 24,
                        textAlign: 'center'
                    }}
                    fontFamily="CeraCY-Regular"
                >
                    No workouts.
                </Text> :
                <View style={{ marginBottom: 48 }}>
                    <MainCard
                        name={dailyFitness?.name}
                        description={dailyFitness?.description}
                        onPress={() => {
                            router.push(`/workout/${dailyFitness?.id}?page_type=exercises`);
                        }}
                    />
                </View>
            }

            <View style={{ marginBottom: 48 }}>
                <View style={styles.textContainer}>
                    <TextBold style={styles.textBoldInner}>
                        Crossfit Daily
                    </TextBold>
                </View>

                {!dailyCrossFit ? (
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
                    <MainCard
                        name={dailyCrossFit?.name}
                        description={dailyCrossFit?.description}
                        onPress={() => {
                            router.push(`/workout/${dailyCrossFit?.id}?page_type=exercises`);
                        }}
                    />
                )}
            </View>

            {missingActivityExercise &&
                <View style={{ marginBottom: 48 }}>
                    <View style={styles.textContainer}>
                        <TextBold style={styles.textBoldInner}>
                            Comeback
                        </TextBold>
                    </View>

                    <MainCard
                        name={missingActivityExercise?.name}
                        description={missingActivityExercise?.description}
                        onPress={() => {
                            router.push(`/workout/${missingActivityExercise?.id}?page_type=exercises`);
                        }}
                    />
                </View>
            }

            <View style={{ marginBottom: 28 }}>
                <TextBold style={styles.textBoldMain}>
                    Protocols_
                </TextBold>

                <Text
                    style={styles.textNormalMain}
                    fontFamily='CeraCY-Regular'
                >
                    Goal-oriented programs designed to deliver measurable results through structured, time-bound training.
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 28 }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={selectedCategoryId === null ? styles.buttonSelectActive : styles.buttonSelect}
                    onPress={() => setAllCategoryWorkouts(categories)}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            textAlign: 'center'
                        }}
                        fontFamily='CeraCY-Regular'
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((category: any) => (
                    <TouchableOpacity
                        key={category?.id}
                        activeOpacity={0.8}
                        style={
                            selectedCategoryId === category?.id
                                ? styles.buttonSelectActive
                                : styles.buttonSelect
                        }
                        onPress={() => setSelectedCategoryWorkouts(category?.id)}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                textAlign: 'center'
                            }}
                            fontFamily='CeraCY-Regular'
                        >
                            {category?.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.protocolContainer}>
                {!categoryWorkouts.length ? (
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
                ) :
                categoryWorkouts.map(categoryWorkout => (
                    <GridImageCard
                        key={categoryWorkout?.id}
                        name={categoryWorkout?.name}
                        durationWeeks={categoryWorkout?.duration_weeks}
                        onPress={() => {
                            router.push(`/workout/${categoryWorkout?.id}?page_type=workout`);
                        }}
                    />
                ))}
            </View>
        </AppLayout>
    )
};

const styles = StyleSheet.create({
    protocolContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 12,
        justifyContent: 'space-between',
        marginBottom: 24
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    textBoldMain: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontSize: 52,
        lineHeight: 52,
        marginBottom: 8
    },
    textNormalMain: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 17,
        marginBottom: 8,
        width: '95%'
    },
    textBoldInner: {
        color: '#FFFFFF',
        fontSize: 24,
        lineHeight: 24,
        textTransform: 'uppercase',
        width: '80%'
    },
    buttonSelect: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#999999',
        marginRight: 8
    },
    buttonSelectActive: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#EDFF4B',
        marginRight: 8,
        backgroundColor: '#3F4600'
    }
});

export default Index;