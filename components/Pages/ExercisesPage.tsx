import {
    StyleSheet,
    View,
    ImageBackground,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import AppLayout from '@/components/Layouts/AppLayout';
import Text from '@/components/Text';
import TextBold from '@/components/TextBold';
import Loader from '@/components/Loader';

import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';
import MainModal from '@/components/MainModal';
import Input from '@/components/Input';
import ReportPainSvg from '@/components/ReportPainSvg';

import asyncStorage from '@/lib/asyncStorage';

// @ts-ignore
import { RatingInput } from 'react-native-stock-star-rating';
import { Checkbox } from 'expo-checkbox';

import WheelPickerExpo from 'react-native-wheel-picker-expo';

const ExercisesPage = ({
    id
}: {
    id: string
}) =>
{
    const { getUserData } = asyncStorage();

    const authorizedFetch = useAuthorizedFetch();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [exercise, setExercise] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedStep, setSelectedStep] = useState<number>(1);
    const [rpeExercises, setRpeExercises] = useState<any[]>([]);
    const [maxRpeSteps, setMaxRpeSteps] = useState<number>(0);

    const exertions = [
        { label: '0 No exertion', value: 0 },
        { label: '1 Very light', value: 1 },
        { label: '2 Light', value: 2 },
        { label: '3 Light', value: 3 },
        { label: '4 Moderate', value: 4 },
        { label: '5 Moderate', value: 5 },
        { label: '6 High', value: 6 },
        { label: '7 High', value: 7 },
        { label: '8 Very hard', value: 8 },
        { label: '9 Very hard', value: 9 },
        { label: '10 Maximum effort', value: 10 }
    ];

    const [selectedExertion, setSelectedExertion] = useState<number>(exertions[3].value);
    const [rpeExertions, setRpeExertions] = useState<any[]>([]);
    const [rating, setRating] = useState<number>(0);

    const [calculateModalVisible, setCalculateModalVisible] = useState<boolean>(false);
    const [selectedCalculateExercise, setCalculateExercise] = useState<any | null>(null);

    const [reportPainModalVisible, setReportPainModalVisible] = useState<boolean>(false);

    const openCalculateModal = (exercise: any | null) =>
    {
        if(!exercise) return;

        setCalculateModalVisible(true);
        setCalculateExercise(exercise);
    };

    const closeCalculateModal = () =>
    {
        setCalculateModalVisible(false);
        setCalculateExercise(null);

        setCalculateFormBodyWeight({
            exercise_id: '',
            maxReps: '',
            targetReps: '',
            bodyWeight: '',
            sets: '',
            weighted: true
        });

        setErrorCalculateFormBodyWeight({
            maxReps: {
                message: '',
                error: false
            },
            targetReps: {
                message: '',
                error: false
            },
            sets: {
                message: '',
                error: false
            },
            bodyWeight: {
                message: '',
                error: false
            }
        });

        setCalculateForm({
            exercise_id: '',
            maxReps: '',
            targetReps: '',
            sets: '',
            maxWeight: '',
            decreaseWeight: false,
            failed: false
        });

        setErrorCalculateForm({
            maxReps: {
                message: '',
                error: false
            },
            targetReps: {
                message: '',
                error: false
            },
            sets: {
                message: '',
                error: false
            },
            maxWeight: {
                message: '',
                error: false
            }
        });

        setSuggestedExercises({
            option_1: [],
            option_2: []
        });
        setSuggestedBodyWeightExercises([]);
    };

    const [calculateForm, setCalculateForm] = useState({
        exercise_id: '',
        maxReps: '',
        targetReps: '',
        sets: '',
        maxWeight: '',
        decreaseWeight: false,
        failed: false
    });
    const [errorCalculateForm, setErrorCalculateForm] = useState({
        maxReps: {
            message: '',
            error: false
        },
        targetReps: {
            message: '',
            error: false
        },
        sets: {
            message: '',
            error: false
        },
        maxWeight: {
            message: '',
            error: false
        }
    });
    const [suggestedExercises, setSuggestedExercises] = useState<any>({
        option_1: [],
        option_2: []
    });

    const calculateWeightedWorkout = async () =>
    {
        setLoading(() => true);

        if(!calculateForm.maxWeight) {
            setErrorCalculateForm(prev => ({
                ...prev,
                maxWeight: {
                    message: 'The max weight field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateForm.maxReps) {
            setErrorCalculateForm(prev => ({
                ...prev,
                maxReps: {
                    message: 'The max reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateForm.targetReps) {
            setErrorCalculateForm(prev => ({
                ...prev,
                targetReps: {
                    message: 'The desired reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateForm.sets) {
            setErrorCalculateForm(prev => ({
                ...prev,
                sets: {
                    message: 'The reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        const { ok, body } = await authorizedFetch(
            'POST',
            'calculate-weighted-workout',
            calculateForm
        );

        if(!ok) {
            if(body?.errors?.maxWeight) {
                setErrorCalculateForm(prev => ({
                    ...prev,
                    maxWeight: {
                        message: body?.errors?.maxWeight[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.maxReps) {
                setErrorCalculateForm(prev => ({
                    ...prev,
                    maxReps: {
                        message: body?.errors?.maxReps[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.targetReps) {
                setErrorCalculateForm(prev => ({
                    ...prev,
                    targetReps: {
                        message: body?.errors?.targetReps[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.sets) {
                setErrorCalculateForm(prev => ({
                    ...prev,
                    sets: {
                        message: body?.errors?.sets[0],
                        error: true
                    }
                }));
            }

            setLoading(() => false);
            return;
        }

        await fetchData();

        setSuggestedExercises({
            option_1: body?.option_1 || [],
            option_2: body?.option_2 || []
        });

        setLoading(() => false);
    };

    const [calculateFormBodyWeight, setCalculateFormBodyWeight] = useState({
        exercise_id: '',
        maxReps: '',
        targetReps: '',
        bodyWeight: '',
        sets: '',
        weighted: true
    });
    const [errorCalculateFormBodyWeight, setErrorCalculateFormBodyWeight] = useState({
        maxReps: {
            message: '',
            error: false
        },
        targetReps: {
            message: '',
            error: false
        },
        sets: {
            message: '',
            error: false
        },
        bodyWeight: {
            message: '',
            error: false
        }
    });
    const [suggestedBodyWeightExercises, setSuggestedBodyWeightExercises] = useState<any[]>([]);

    const calculateBodyWeightWorkout = async () =>
    {
        setLoading(() => true);

        if(!calculateFormBodyWeight.bodyWeight) {
            setErrorCalculateFormBodyWeight(prev => ({
                ...prev,
                bodyWeight: {
                    message: 'The body weight field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateFormBodyWeight.maxReps) {
            setErrorCalculateFormBodyWeight(prev => ({
                ...prev,
                maxReps: {
                    message: 'The max reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateFormBodyWeight.targetReps) {
            setErrorCalculateFormBodyWeight(prev => ({
                ...prev,
                targetReps: {
                    message: 'The desired reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        if(!calculateFormBodyWeight.sets) {
            setErrorCalculateFormBodyWeight(prev => ({
                ...prev,
                sets: {
                    message: 'The reps field is required.',
                    error: true
                }
            }));

            setLoading(() => false);
            return;
        }

        const { ok, body } = await authorizedFetch(
            'POST',
            'calculate-body-weight-workout',
            calculateFormBodyWeight
        );

        if(!ok) {
            if(body?.errors?.bodyWeight) {
                setErrorCalculateFormBodyWeight(prev => ({
                    ...prev,
                    bodyWeight: {
                        message: body?.errors?.bodyWeight[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.maxReps) {
                setErrorCalculateFormBodyWeight(prev => ({
                    ...prev,
                    maxReps: {
                        message: body?.errors?.maxReps[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.targetReps) {
                setErrorCalculateFormBodyWeight(prev => ({
                    ...prev,
                    targetReps: {
                        message: body?.errors?.targetReps[0],
                        error: true
                    }
                }));
            }

            if(body?.errors?.sets) {
                setErrorCalculateFormBodyWeight(prev => ({
                    ...prev,
                    sets: {
                        message: body?.errors?.sets[0],
                        error: true
                    }
                }));
            }

            setLoading(() => false);
            return;
        }

        await fetchData();

        setSuggestedBodyWeightExercises(body?.workout);
        setLoading(() => false);
    };

    useEffect(() => {
        if(selectedCalculateExercise?.is_body_weight === 0) {
            setCalculateForm(prev => ({
                ...prev,
                exercise_id: selectedCalculateExercise?.id
            }));
        } else {
            setCalculateFormBodyWeight(prev => ({
                ...prev,
                exercise_id: selectedCalculateExercise?.id
            }));
        }
    }, [selectedCalculateExercise]);

    const closeModal = () =>
    {
        setModalVisible(false);
        setRpeExertions([]);
        setSelectedStep(1);
        setRating(0);
    };

    const setIncrementStep = (id: number | null = null) =>
    {

        if (selectedStep >= maxRpeSteps) return;

        if (id === null) {
            setSelectedStep(prev => prev + 1);
            return;
        }

        setRpeExertions(prev => {
            const existingIndex = prev.findIndex(entry => Object.keys(entry)[0] === String(id));
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = { [id]: selectedExertion };
                return updated;
            }

            return [...prev, { [id]: selectedExertion }];
        });

        setSelectedStep(prev => prev + 1);
    };

    const setDecrementStep = () =>
    {
        if(selectedStep === 1) return;

        setRating(0);
        setSelectedStep((value: number) => value - 1);
    };

    const fetchData = async () =>
    {
        setLoading(true);

        if(!id) {
            setLoading(false);
            return;
        }

        const response = await authorizedFetch('GET', `workouts/exercises?workout_id=${id}`);

        if(response.ok) {
            setExercise(response.body?.workout);
        }

        setLoading(false);
    };

    const completeWorkout = async (skipReview: boolean = false) =>
    {
        setLoading(true);

        if(!skipReview) {
            const user = await getUserData();
            if(!user) {
                setLoading(false);
                return;
            }

            await authorizedFetch(
                'POST',
                'workout-review',
                {
                    user_id: user?.id,
                    rate: rating,
                    workout_id: id,
                    description: ''
                }
            );
        }

        const response = await authorizedFetch(
            'POST',
            `workout-complete/${id}`,
            {
                exercise_rpes: rpeExertions
            }
        );

        if(response.ok) {
            router.push('/(tabs)');
            setLoading(false);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData().then();
    }, [id]);

    useEffect(() => {
        if (exercise) {
            const filteredRpeExercises = exercise.exercises?.filter((value: any) => value.is_rpe === 1) ?? [];
            setRpeExercises(filteredRpeExercises);
            setMaxRpeSteps(filteredRpeExercises.length + 4);
        }
    }, [exercise]);

    const [selectedBodyPart, setSelectedBodyPart] = useState<any | null>(null);
    const [selectedPainExertion, setSelectedPainExertion] = useState<number>(3);
    const [reportPainStep, setReportPainStep] = useState<number>(1);

    const closeReportPainModal = () =>
    {
        setSelectedPainExertion(3);
        setReportPainStep(1);
        setSelectedBodyPart(null);
        setReportPainModalVisible(false);
    };

    const reportPain = async () =>
    {
        setLoading(true);

        const response = await authorizedFetch(
            'POST',
            `user-injuries`,
            {
                notes: `i feel pain in ${selectedBodyPart?.name}`,
                workout_id: id,
                body_part_id: selectedBodyPart?.id,
                pain_intensity: selectedPainExertion
            }
        );

        if(response.ok) {
            setReportPainStep(() => 3);
            setLoading(false);
        }

        setLoading(false);
    };

    const renderReportPain = () =>
    {
        switch (reportPainStep) {
            case 1:
                return (
                    <>
                        <TextBold
                            style={{
                                color: '#FFFFFF',
                                marginBottom: 16,
                                textAlign: 'center',
                                fontSize: 32,
                                lineHeight: 32
                            }}
                        >
                            Report pain
                        </TextBold>

                        <Text
                            style={{
                                color: '#FFFFFF',
                                textAlign: 'center',
                                fontSize: 14,
                                lineHeight: 14,
                                marginBottom: 32
                            }}
                        >
                            Select the painfull area
                        </Text>

                        <View
                            style={{
                                alignItems: 'center',
                                marginBottom: 32
                            }}
                        >
                            <ReportPainSvg
                                onSelect={(selectedBodyPart: any) => {
                                    setSelectedBodyPart(() => selectedBodyPart);
                                    setReportPainStep(previous => previous + 1);
                                }}
                            />
                        </View>
                    </>
                );
            case 2:
                return (
                    <>
                        <View
                            style={{
                                borderColor: '#747474',
                                borderBottomWidth: 1,
                                paddingBottom: 16,
                                marginBottom: 24,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontWeight: 400,
                                        fontSize: 12,
                                        lineHeight: 12,
                                        opacity: 0.5,
                                        marginBottom: 4
                                    }}
                                >
                                    Painful area
                                </Text>

                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 20,
                                        lineHeight: 20,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {selectedBodyPart?.name}
                                </TextBold>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setReportPainStep(previous => previous - 1)}
                            >
                                <Text
                                    style={{
                                        color: '#EDFF4B',
                                        fontWeight: 400,
                                        fontSize: 13,
                                        lineHeight: 13,
                                        opacity: 0.5,
                                        marginBottom: 4
                                    }}
                                >
                                    Change
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TextBold
                                style={{
                                    color: '#FFFFFF',
                                    marginBottom: 40,
                                    textAlign: 'center',
                                    fontSize: 32,
                                    lineHeight: 32
                                }}
                            >
                                Select intesity
                            </TextBold>

                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 20,
                                    lineHeight: 20,
                                    color: '#FFFFFF',
                                    opacity: 0.5,
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    marginBottom: 53
                                }}
                                fontFamily={'CeraCY-Regular'}
                            >
                                Pain intensity {selectedPainExertion}
                            </Text>

                            <WheelPickerExpo
                                backgroundColor='#000000'
                                height={204}
                                width={279}
                                items={exertions}
                                initialSelectedIndex={3}
                                onChange={({ item }) => setSelectedPainExertion(item?.value)}
                            />

                            <PolygonButtonCustom
                                text='Submit'
                                cardColor={'#FFFFFF'}
                                onPress={() => reportPain()}
                                style={{ marginTop: 53 }}
                            />
                        </View>
                    </>
                );
            case 3:
                return (
                    <>
                        <View
                            style={{
                                borderColor: '#747474',
                                borderBottomWidth: 1,
                                paddingBottom: 16,
                                marginBottom: 24,
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontWeight: 400,
                                        fontSize: 12,
                                        lineHeight: 12,
                                        opacity: 0.5,
                                        marginBottom: 4
                                    }}
                                >
                                    Painful area
                                </Text>

                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 20,
                                        lineHeight: 20,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {selectedBodyPart?.name}
                                </TextBold>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 300
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 400,
                                    fontSize: 20,
                                    lineHeight: 20,
                                    marginBottom: 16,
                                    textTransform: 'uppercase',
                                    textAlign: 'center'
                                }}
                                fontFamily={'CeraCY-Regular'}
                            >
                                Disclaimer
                            </Text>

                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: 12,
                                    lineHeight: 12,
                                    opacity: 0.5
                                }}
                            >
                                This application does not provide medical diagnosis or professional medical advice. Any information, suggestions, or indications shown in the app are for informational purposes only and should not be used as a substitute for consultation with a qualified healthcare professional. Regardless of the guidance or results provided by the application, you should always seek evaluation, advice, and confirmation from a licensed medical doctor. Never disregard professional medical advice or delay seeking it because of information obtained from this application.
                            </Text>
                        </View>

                        <PolygonButtonCustom
                            text='Ok'
                            cardColor={'#FFFFFF'}
                            onPress={() => closeReportPainModal()}
                            style={{ marginTop: 53 }}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    if(loading)
        return <Loader />;

    return (
        <AppLayout avoidGlobalPadding={true}>
            <ImageBackground
                style={styles.backgroundImageContainer}
                resizeMode='cover'
                source={require('@/assets/images/workout-image.png')}
            >
                <View style={styles.mainContainer}>
                    <TextBold
                        style={styles.mainTextBackground}
                        ellipsizeMode='tail'
                        numberOfLines={2}
                    >
                        {exercise?.name}_
                    </TextBold>

                    <View style={styles.mainBottomTextContainer}>
                        <Image
                            source={require('@/assets/images/barbell-icon.png')}
                            style={{ width: 24, height: 24 }}
                        />

                        <Text style={styles.smallTextBackground}>
                            {exercise?.exercises?.length ?? 0} exercises
                        </Text>
                    </View>
                </View>
            </ImageBackground>

            <View style={{ paddingHorizontal: 24 }}>
                {exercise?.exercises?.map((value: any) =>
                    <TouchableOpacity
                        key={value?.id}
                        style={{
                            padding: 16,
                            backgroundColor: '#242424',
                            marginBottom: 16
                        }}
                        activeOpacity={0.8}
                        onPress={() => {
                            router.push(`/workout/${id}?page_type=exercise&exercise_id=${value?.id}`);
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TextBold
                                ellipsizeMode='tail'
                                numberOfLines={1}
                                style={styles.cardHeadingText}
                            >
                                {value?.name}
                            </TextBold>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.buttonImageContainer}
                            >
                                <Image
                                    source={require('@/assets/images/dots.png')}
                                    style={{ width: 3, height: 15 }}
                                />
                            </TouchableOpacity>
                        </View>

                        {value?.modality === 'repetition-based' &&
                            <View style={styles.cardContainer}>
                                <View>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                        {value?.calculated_sets.length === 0 ? '?' : value?.calculated_sets.length}
                                    </Text>
                                </View>

                                <View>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                        {value?.calculated_sets.length === 0 ? '?' : value?.calculated_sets[0]?.reps ?? '?'}
                                    </Text>
                                </View>

                                <View>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Weight</Text>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                        {value?.calculated_sets.length === 0 ? '?' : `${value?.calculated_sets[0]?.weight} KG` || '?'}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.buttonImageContainer}
                                >
                                    <Image
                                        source={require('@/assets/images/line-dots.png')}
                                        style={{ width: 18, height: 15 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

                        {value?.modality && value?.modality !== 'repetition-based' &&
                            <Text
                                fontFamily='CeraCY-Regular'
                                style={{
                                    color: '#FFFFFF',
                                    marginTop: 16,
                                    textTransform: 'uppercase'
                                }}
                            >
                                {value.modality.replace(/-/g, ' ')}
                            </Text>
                        }

                        {value?.modality === 'repetition-based' && value?.calculated_sets.length === 0 &&
                            <PolygonButtonCustom
                                text='Let’s calculate this'
                                style={{
                                    width: '80%',
                                    marginTop: 16
                                }}
                                onPress={() => openCalculateModal(value ?? null)}
                            />
                        }
                    </TouchableOpacity>
                )}

                <View style={{ marginTop: 43 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8
                        }}
                        onPress={() => setReportPainModalVisible(true)}
                    >
                        <Image
                            source={require('@/assets/images/bolt-icon.png')}
                            style={{
                                width: 16,
                                height: 16
                            }}
                        />

                        <Text style={styles.reportPainText}>Report Pain</Text>
                    </TouchableOpacity>

                    <PolygonButtonCustom
                        text='Complete Workout'
                        onPress={() => setModalVisible(true)}
                        style={{ marginBottom: 23 }}
                        cardColor='#EDFF4B'
                    />
                </View>
            </View>

            <MainModal
                modalVisible={modalVisible}
                setModalVisible={() => closeModal()}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {selectedStep === 1 && rpeExercises.length > 0 &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 14,
                                        lineHeight: 14,
                                        textAlign: 'center',
                                        marginBottom: 16
                                    }}
                                    fontFamily='CeraCY-Regular'
                                >
                                    We need your feedback for these:
                                </Text>

                                {rpeExercises?.map((value: any) =>
                                    <Text
                                        key={value?.id}
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            marginBottom: 8,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {value?.name}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => closeModal()}
                                >
                                    <Image
                                        source={require('@/assets/images/hourglass-icon.png')}
                                        style={{
                                            width: 16,
                                            height: 16
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16
                                        }}
                                    >
                                        Remind Me Later
                                    </Text>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        marginVertical: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    or
                                </Text>

                                <PolygonButtonCustom
                                    text='Next'
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {rpeExercises.map((rpeExercise: any, index: number) => {
                        const step = index + 2;
                        if(step === selectedStep) {
                            return (
                                <React.Fragment key={rpeExercise?.id}>
                                    <View>
                                        <Text
                                            fontFamily='ChakraPetch-Regular'
                                            style={{
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                marginBottom: 8,
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            How did that feel?
                                        </Text>

                                        <TextBold
                                            style={{
                                                fontSize: 24,
                                                lineHeight: 24,
                                                color: '#FFFFFF',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {rpeExercise?.name}
                                        </TextBold>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <WheelPickerExpo
                                            backgroundColor='#000000'
                                            height={204}
                                            width={279}
                                            items={exertions}
                                            initialSelectedIndex={3}
                                            onChange={({ item }) => setSelectedExertion(item.value)}
                                        />
                                    </View>

                                    <View
                                        key={rpeExercise?.id}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{ width: '50%' }}
                                            onPress={setDecrementStep}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 16,
                                                    lineHeight: 16,
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                Back
                                            </Text>
                                        </TouchableOpacity>

                                        <PolygonButtonCustom
                                            text='Next'
                                            style={{ width: '50%' }}
                                            onPress={() => setIncrementStep(rpeExercise?.id)}
                                        />
                                    </View>
                                </React.Fragment>
                            )
                        }
                    })}

                    {rpeExercises.length > 0 && rpeExercises.length + 2 === selectedStep &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                {rpeExertions.map((rpeExertion: any) => {
                                    const [exerciseId, exertionValue] = Object.entries(rpeExertion)[0];
                                    const exercise = rpeExercises.find((rpeExercise: any) => String(rpeExercise?.id) === String(exerciseId));

                                    return (
                                        <View
                                            key={exercise?.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                marginBottom: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {String(exertionValue)}
                                            </Text>
                                            <TextBold
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {exercise?.name}
                                            </TextBold>
                                        </View>
                                    );
                                })}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{ width: '50%' }}
                                    onPress={setDecrementStep}
                                >
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Back
                                    </Text>
                                </TouchableOpacity>

                                <PolygonButtonCustom
                                    text='Next'
                                    style={{ width: '50%' }}
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {((rpeExercises.length > 0 && rpeExercises.length + 3 === selectedStep) || (rpeExercises.length === 0 && selectedStep === 1)) &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    Rate workout
                                </TextBold>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 16
                                }}
                            >
                                <View
                                    style={{
                                        width: '30%'
                                    }}
                                >
                                    <Image
                                        source={require('@/assets/images/workout-image.png')}
                                        style={{ width: '100%', height: 145, objectFit: 'contain' }}
                                    />
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'flex-end',
                                        width: '70%'
                                    }}
                                >
                                    <TextBold
                                        style={{
                                            fontSize: 24,
                                            lineHeight: 24,
                                            color: '#FFFFFF',
                                            textTransform: 'uppercase',
                                            marginBottom: 16
                                        }}
                                        ellipsizeMode='tail'
                                        numberOfLines={2}
                                    >
                                        {exercise?.name}_
                                    </TextBold>

                                    <View style={styles.mainBottomTextContainer}>
                                        <Image
                                            source={require('@/assets/images/barbell-icon.png')}
                                            style={{ width: 24, height: 24 }}
                                        />

                                        <Text style={styles.smallTextBackground}>
                                            {exercise?.exercises?.length ?? 0} exercises
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    marginVertical: 57,
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    fontFamily='CeraCY-Regular'
                                    style={{
                                        color: '#FFFFFF',
                                        textAlign: 'center',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16
                                    }}
                                >
                                    Select your rating:
                                </Text>

                                <View
                                    style={{
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <RatingInput
                                        maxStars={5}
                                        rating={rating}
                                        setRating={setRating}
                                        size={33}
                                        color='#EDFF4B'
                                        onRating={() => {}}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    gap: 32,
                                    justifyContent: 'center'
                                }}
                            >
                                {rating === 0 &&
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => completeWorkout(true)}
                                    >
                                        <Text
                                            style={{
                                                color: '#FFFFFF',
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Skip
                                        </Text>
                                    </TouchableOpacity>
                                }

                                <PolygonButtonCustom
                                    text='Submit'
                                    cardColor={'#EDFF4B'}
                                    onPress={() => completeWorkout()}
                                />
                            </View>
                        </>
                    }
                </View>
            </MainModal>

            <MainModal
                modalVisible={calculateModalVisible}
                setModalVisible={() => closeCalculateModal()}
            >
                <>
                    <TextBold
                        style={{
                            color: '#FFFFFF',
                            fontSize: 20,
                            lineHeight: 20,
                            marginBottom: 32,
                            textAlign: 'center',
                            textTransform: 'uppercase'
                        }}
                    >
                        {selectedCalculateExercise?.name}
                    </TextBold>

                    <View
                        style={{
                            alignItems: 'center'
                        }}
                    >
                        <TextBold
                            style={{
                                color: '#FFFFFF',
                                fontSize: 32,
                                lineHeight: 40,
                                textAlign: 'center',
                                marginBottom: 32,
                                width: '60%'
                            }}
                        >
                            Exercise calculation
                        </TextBold>
                    </View>

                    <ScrollView style={{ maxHeight: 340 }}>
                        {selectedCalculateExercise?.is_body_weight === 0 && (suggestedExercises.option_1.length === 0 && suggestedExercises.option_2.length === 0) ?
                            <View>
                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER MAX WEIGHT'
                                    value={calculateForm.maxWeight}
                                    onChange={value => {
                                        setCalculateForm(prev => ({
                                            ...prev,
                                            maxWeight: value
                                        }));

                                        setErrorCalculateForm(prev => ({
                                            ...prev,
                                            maxWeight: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateForm.maxWeight.error}
                                    errorText={errorCalculateForm.maxWeight.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER MAX REPS'
                                    value={calculateForm.maxReps}
                                    onChange={value => {
                                        setCalculateForm(prev => ({
                                            ...prev,
                                            maxReps: value
                                        }));

                                        setErrorCalculateForm(prev => ({
                                            ...prev,
                                            maxReps: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateForm.maxReps.error}
                                    errorText={errorCalculateForm.maxReps.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER DESIRED MAX REPS'
                                    value={calculateForm.targetReps}
                                    onChange={value => {
                                        setCalculateForm(prev => ({
                                            ...prev,
                                            targetReps: value
                                        }));

                                        setErrorCalculateForm(prev => ({
                                            ...prev,
                                            targetReps: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateForm.targetReps.error}
                                    errorText={errorCalculateForm.targetReps.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER SETS'
                                    value={calculateForm.sets}
                                    onChange={value => {
                                        setCalculateForm(prev => ({
                                            ...prev,
                                            sets: value
                                        }));

                                        setErrorCalculateForm(prev => ({
                                            ...prev,
                                            sets: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateForm.sets.error}
                                    errorText={errorCalculateForm.sets.message}
                                />

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        alignItems: 'center',
                                        marginBottom: 16
                                    }}
                                >
                                    <Checkbox
                                        value={calculateForm.decreaseWeight}
                                        onValueChange={(value) => {
                                            setCalculateForm(prev => ({
                                                ...prev,
                                                decreaseWeight: value
                                            }));
                                        }}
                                        color={calculateForm.decreaseWeight ? '#656C26' : '#FFFFFF'}
                                    />

                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16
                                        }}
                                        fontFamily='ChakraPetch-Regular'
                                    >
                                        Should decrease weight?
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        alignItems: 'center',
                                        marginBottom: 32
                                    }}
                                >
                                    <Checkbox
                                        value={calculateForm.failed}
                                        onValueChange={(value) => {
                                            setCalculateForm(prev => ({
                                                ...prev,
                                                failed: value
                                            }));
                                        }}
                                        color={calculateForm.failed ? '#656C26' : '#FFFFFF'}
                                    />

                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16
                                        }}
                                        fontFamily='ChakraPetch-Regular'
                                    >
                                        Did you fail the exercise?
                                    </Text>
                                </View>

                                <PolygonButtonCustom
                                    text='Calculate'
                                    onPress={() => calculateWeightedWorkout()}
                                />
                            </View>
                        : selectedCalculateExercise?.is_body_weight === 0 &&
                            <View>
                                {suggestedExercises.option_1.map((option: any, index: number) => (
                                    <View
                                        key={index}
                                        style={{
                                            padding: 16,
                                            backgroundColor: '#242424',
                                            marginBottom: 16
                                        }}
                                    >
                                        <View style={styles.cardContainer}>
                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.set}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.reps}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Weight</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.weight}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                {suggestedExercises.option_2.map((option: any, index: number) => (
                                    <View
                                        key={index}
                                        style={{
                                            padding: 16,
                                            backgroundColor: '#242424',
                                            marginBottom: 16
                                        }}
                                    >
                                        <View style={styles.cardContainer}>
                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.set}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.reps}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Weight</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.weight}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        }

                        {selectedCalculateExercise?.is_body_weight === 1 && suggestedBodyWeightExercises.length === 0 ?
                            <View>
                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER BODY WEIGHT'
                                    value={calculateFormBodyWeight.bodyWeight}
                                    onChange={value => {
                                        setCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            bodyWeight: value
                                        }));

                                        setErrorCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            bodyWeight: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateFormBodyWeight.bodyWeight.error}
                                    errorText={errorCalculateFormBodyWeight.bodyWeight.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER MAX REPS'
                                    value={calculateFormBodyWeight.maxReps}
                                    onChange={value => {
                                        setCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            maxReps: value
                                        }));

                                        setErrorCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            maxReps: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateFormBodyWeight.maxReps.error}
                                    errorText={errorCalculateFormBodyWeight.maxReps.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER DESIRED MAX REPS'
                                    value={calculateFormBodyWeight.targetReps}
                                    onChange={value => {
                                        setCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            targetReps: value
                                        }));

                                        setErrorCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            targetReps: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateFormBodyWeight.targetReps.error}
                                    errorText={errorCalculateFormBodyWeight.targetReps.message}
                                />

                                <Input
                                    textWhite={true}
                                    style={{ marginBottom: 32 }}
                                    label='ENTER SETS'
                                    value={calculateFormBodyWeight.sets}
                                    onChange={value => {
                                        setCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            sets: value
                                        }));

                                        setErrorCalculateFormBodyWeight(prev => ({
                                            ...prev,
                                            sets: {
                                                message: '',
                                                error: false
                                            }
                                        }));
                                    }}
                                    inputMode='numeric'
                                    error={errorCalculateFormBodyWeight.sets.error}
                                    errorText={errorCalculateFormBodyWeight.sets.message}
                                />

                                <PolygonButtonCustom
                                    text='Calculate'
                                    onPress={() => calculateBodyWeightWorkout()}
                                />
                            </View>
                        : selectedCalculateExercise?.is_body_weight === 1 &&
                            <View>
                                {suggestedBodyWeightExercises.map((option: any, index: number) => (
                                    <View
                                        key={index}
                                        style={{
                                            padding: 16,
                                            backgroundColor: '#242424',
                                            marginBottom: 16
                                        }}
                                    >
                                        <ScrollView contentContainerStyle={styles.cardContainer}>
                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.set ?? '?'}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                                <Text
                                                    fontFamily='CeraCY-Regular'
                                                    style={styles.cardText}
                                                    ellipsizeMode='tail'
                                                    numberOfLines={5}
                                                >
                                                    {option?.reps ?? '?'}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Weight</Text>
                                                <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                    {option?.weight ?? '?'}
                                                </Text>
                                            </View>
                                        </ScrollView>
                                    </View>
                                ))}
                            </View>
                        }
                    </ScrollView>
                </>
            </MainModal>

            <MainModal
                modalVisible={modalVisible}
                setModalVisible={() => closeModal()}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {selectedStep === 1 && rpeExercises.length > 0 &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 14,
                                        lineHeight: 14,
                                        textAlign: 'center',
                                        marginBottom: 16
                                    }}
                                    fontFamily='CeraCY-Regular'
                                >
                                    We need your feedback for these:
                                </Text>

                                {rpeExercises?.map((value: any) =>
                                    <Text
                                        key={value?.id}
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            marginBottom: 8,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {value?.name}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => closeModal()}
                                >
                                    <Image
                                        source={require('@/assets/images/hourglass-icon.png')}
                                        style={{
                                            width: 16,
                                            height: 16
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16
                                        }}
                                    >
                                        Remind Me Later
                                    </Text>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        marginVertical: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    or
                                </Text>

                                <PolygonButtonCustom
                                    text='Next'
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {rpeExercises.map((rpeExercise: any, index: number) => {
                        const step = index + 2;
                        if(step === selectedStep) {
                            return (
                                <React.Fragment key={rpeExercise?.id}>
                                    <View>
                                        <Text
                                            fontFamily='ChakraPetch-Regular'
                                            style={{
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                marginBottom: 8,
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            How did that feel?
                                        </Text>

                                        <TextBold
                                            style={{
                                                fontSize: 24,
                                                lineHeight: 24,
                                                color: '#FFFFFF',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {rpeExercise?.name}
                                        </TextBold>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <WheelPickerExpo
                                            backgroundColor='#000000'
                                            height={204}
                                            width={279}
                                            items={exertions}
                                            initialSelectedIndex={3}
                                            onChange={({ item }) => setSelectedExertion(item.value)}
                                        />
                                    </View>

                                    <View
                                        key={rpeExercise?.id}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{ width: '50%' }}
                                            onPress={setDecrementStep}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 16,
                                                    lineHeight: 16,
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                Back
                                            </Text>
                                        </TouchableOpacity>

                                        <PolygonButtonCustom
                                            text='Next'
                                            style={{ width: '50%' }}
                                            onPress={() => setIncrementStep(rpeExercise?.id)}
                                        />
                                    </View>
                                </React.Fragment>
                            )
                        }
                    })}

                    {rpeExercises.length > 0 && rpeExercises.length + 2 === selectedStep &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                {rpeExertions.map((rpeExertion: any) => {
                                    const [exerciseId, exertionValue] = Object.entries(rpeExertion)[0];
                                    const exercise = rpeExercises.find((rpeExercise: any) => String(rpeExercise?.id) === String(exerciseId));

                                    return (
                                        <View
                                            key={exercise?.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                marginBottom: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {String(exertionValue)}
                                            </Text>
                                            <TextBold
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {exercise?.name}
                                            </TextBold>
                                        </View>
                                    );
                                })}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{ width: '50%' }}
                                    onPress={setDecrementStep}
                                >
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Back
                                    </Text>
                                </TouchableOpacity>

                                <PolygonButtonCustom
                                    text='Next'
                                    style={{ width: '50%' }}
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {((rpeExercises.length > 0 && rpeExercises.length + 3 === selectedStep) || (rpeExercises.length === 0 && selectedStep === 1)) &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    Rate workout
                                </TextBold>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 16
                                }}
                            >
                                <View
                                    style={{
                                        width: '30%'
                                    }}
                                >
                                    <Image
                                        source={require('@/assets/images/workout-image.png')}
                                        style={{ width: '100%', height: 145, objectFit: 'contain' }}
                                    />
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'flex-end',
                                        width: '70%'
                                    }}
                                >
                                    <TextBold
                                        style={{
                                            fontSize: 24,
                                            lineHeight: 24,
                                            color: '#FFFFFF',
                                            textTransform: 'uppercase',
                                            marginBottom: 16
                                        }}
                                        ellipsizeMode='tail'
                                        numberOfLines={2}
                                    >
                                        {exercise?.name}_
                                    </TextBold>

                                    <View style={styles.mainBottomTextContainer}>
                                        <Image
                                            source={require('@/assets/images/barbell-icon.png')}
                                            style={{ width: 24, height: 24 }}
                                        />

                                        <Text style={styles.smallTextBackground}>
                                            {exercise?.exercises?.length ?? 0} exercises
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    marginVertical: 57,
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    fontFamily='CeraCY-Regular'
                                    style={{
                                        color: '#FFFFFF',
                                        textAlign: 'center',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16
                                    }}
                                >
                                    Select your rating:
                                </Text>

                                <View
                                    style={{
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <RatingInput
                                        maxStars={5}
                                        rating={rating}
                                        setRating={setRating}
                                        size={33}
                                        color='#EDFF4B'
                                        onRating={() => {}}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    gap: 32,
                                    justifyContent: 'center'
                                }}
                            >
                                {rating === 0 &&
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => completeWorkout(true)}
                                    >
                                        <Text
                                            style={{
                                                color: '#FFFFFF',
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Skip
                                        </Text>
                                    </TouchableOpacity>
                                }

                                <PolygonButtonCustom
                                    text='Submit'
                                    cardColor={'#EDFF4B'}
                                    onPress={() => completeWorkout()}
                                />
                            </View>
                        </>
                    }
                </View>
            </MainModal>

            <MainModal
                modalVisible={modalVisible}
                setModalVisible={() => closeModal()}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {selectedStep === 1 && rpeExercises.length > 0 &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 14,
                                        lineHeight: 14,
                                        textAlign: 'center',
                                        marginBottom: 16
                                    }}
                                    fontFamily='CeraCY-Regular'
                                >
                                    We need your feedback for these:
                                </Text>

                                {rpeExercises?.map((value: any) =>
                                    <Text
                                        key={value?.id}
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            marginBottom: 8,
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {value?.name}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 8,
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => closeModal()}
                                >
                                    <Image
                                        source={require('@/assets/images/hourglass-icon.png')}
                                        style={{
                                            width: 16,
                                            height: 16
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16
                                        }}
                                    >
                                        Remind Me Later
                                    </Text>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        marginVertical: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    or
                                </Text>

                                <PolygonButtonCustom
                                    text='Next'
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {rpeExercises.map((rpeExercise: any, index: number) => {
                        const step = index + 2;
                        if(step === selectedStep) {
                            return (
                                <React.Fragment key={rpeExercise?.id}>
                                    <View>
                                        <Text
                                            fontFamily='ChakraPetch-Regular'
                                            style={{
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                marginBottom: 8,
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            How did that feel?
                                        </Text>

                                        <TextBold
                                            style={{
                                                fontSize: 24,
                                                lineHeight: 24,
                                                color: '#FFFFFF',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {rpeExercise?.name}
                                        </TextBold>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <WheelPickerExpo
                                            backgroundColor='#000000'
                                            height={204}
                                            width={279}
                                            items={exertions}
                                            initialSelectedIndex={3}
                                            onChange={({ item }) => setSelectedExertion(item.value)}
                                        />
                                    </View>

                                    <View
                                        key={rpeExercise?.id}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{ width: '50%' }}
                                            onPress={setDecrementStep}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    fontSize: 16,
                                                    lineHeight: 16,
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                Back
                                            </Text>
                                        </TouchableOpacity>

                                        <PolygonButtonCustom
                                            text='Next'
                                            style={{ width: '50%' }}
                                            onPress={() => setIncrementStep(rpeExercise?.id)}
                                        />
                                    </View>
                                </React.Fragment>
                            )
                        }
                    })}

                    {rpeExercises.length > 0 && rpeExercises.length + 2 === selectedStep &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    How did that feel?
                                </TextBold>
                            </View>

                            <View>
                                {rpeExertions.map((rpeExertion: any) => {
                                    const [exerciseId, exertionValue] = Object.entries(rpeExertion)[0];
                                    const exercise = rpeExercises.find((rpeExercise: any) => String(rpeExercise?.id) === String(exerciseId));

                                    return (
                                        <View
                                            key={exercise?.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                                marginBottom: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {String(exertionValue)}
                                            </Text>
                                            <TextBold
                                                style={{
                                                    color: '#FFFFFF',
                                                    textTransform: 'uppercase',
                                                    fontSize: 16,
                                                    lineHeight: 16
                                                }}
                                            >
                                                {exercise?.name}
                                            </TextBold>
                                        </View>
                                    );
                                })}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{ width: '50%' }}
                                    onPress={setDecrementStep}
                                >
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            lineHeight: 16,
                                            textAlign: 'center',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Back
                                    </Text>
                                </TouchableOpacity>

                                <PolygonButtonCustom
                                    text='Next'
                                    style={{ width: '50%' }}
                                    onPress={() => setIncrementStep(null)}
                                />
                            </View>
                        </>
                    }

                    {((rpeExercises.length > 0 && rpeExercises.length + 3 === selectedStep) || (rpeExercises.length === 0 && selectedStep === 1)) &&
                        <>
                            <View>
                                <TextBold
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 32,
                                        lineHeight: 32,
                                        textAlign: 'center'
                                    }}
                                >
                                    Rate workout
                                </TextBold>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 16
                                }}
                            >
                                <View
                                    style={{
                                        width: '30%'
                                    }}
                                >
                                    <Image
                                        source={require('@/assets/images/workout-image.png')}
                                        style={{ width: '100%', height: 145, objectFit: 'contain' }}
                                    />
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'flex-end',
                                        width: '70%'
                                    }}
                                >
                                    <TextBold
                                        style={{
                                            fontSize: 24,
                                            lineHeight: 24,
                                            color: '#FFFFFF',
                                            textTransform: 'uppercase',
                                            marginBottom: 16
                                        }}
                                        ellipsizeMode='tail'
                                        numberOfLines={2}
                                    >
                                        {exercise?.name}_
                                    </TextBold>

                                    <View style={styles.mainBottomTextContainer}>
                                        <Image
                                            source={require('@/assets/images/barbell-icon.png')}
                                            style={{ width: 24, height: 24 }}
                                        />

                                        <Text style={styles.smallTextBackground}>
                                            {exercise?.exercises?.length ?? 0} exercises
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    marginVertical: 57,
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    fontFamily='CeraCY-Regular'
                                    style={{
                                        color: '#FFFFFF',
                                        textAlign: 'center',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16
                                    }}
                                >
                                    Select your rating:
                                </Text>

                                <View
                                    style={{
                                        alignItems: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <RatingInput
                                        maxStars={5}
                                        rating={rating}
                                        setRating={setRating}
                                        size={33}
                                        color='#EDFF4B'
                                        onRating={() => {}}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    gap: 32,
                                    justifyContent: 'center'
                                }}
                            >
                                {rating === 0 &&
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => completeWorkout(true)}
                                    >
                                        <Text
                                            style={{
                                                color: '#FFFFFF',
                                                fontSize: 16,
                                                lineHeight: 16,
                                                textAlign: 'center',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Skip
                                        </Text>
                                    </TouchableOpacity>
                                }

                                <PolygonButtonCustom
                                    text='Submit'
                                    cardColor={'#EDFF4B'}
                                    onPress={() => completeWorkout()}
                                />
                            </View>
                        </>
                    }
                </View>
            </MainModal>

            <MainModal
                modalVisible={reportPainModalVisible}
                setModalVisible={() => closeReportPainModal()}
            >
                {renderReportPain()}
            </MainModal>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    backgroundImageContainer: {
        height: 399,
        width: '100%',
        marginBottom: 24
    },
    mainContainer: {
        padding: 24,
        height: '100%',
        justifyContent: 'flex-end'
    },
    mainBottomTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    mainTextBackground: {
        color: 'white',
        fontSize: 30,
        lineHeight: 30,
        textTransform: 'uppercase',
        marginBottom: 16
    },
    smallTextBackground: {
        color: '#FFFFFF',
        alignItems: 'center'
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    cardHeadingText: {
        textTransform: 'uppercase',
        fontSize: 16,
        lineHeight: 16,
        marginBottom: 20,
        color: '#FFFFFF'
    },
    cardText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '400',
        textTransform: 'uppercase'
    },
    buttonImageContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reportPainText: {
        textTransform: 'uppercase',
        color: '#FFFFFF',
        marginBottom: 32,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 16,
        fontWeight: '500'
    }
});

export default ExercisesPage;
