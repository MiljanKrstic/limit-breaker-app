import AppLayout from '@/components/Layouts/AppLayout';
import Text from '@/components/Text';
import TextBold from '@/components/TextBold';
import Loader from '@/components/Loader';
import NeutralCard from '@/components/NeutralCard';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';
import MainModal from '@/components/MainModal';
import Input from '@/components/Input';

import React, { useEffect, useState } from 'react';
import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';

import { Image } from 'expo-image';
import { Checkbox } from 'expo-checkbox';

import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import ReportPainSvg from '@/components/ReportPainSvg';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const ExercisePage = ({
    id,
    exercise_id
}: {
    id: string;
    exercise_id?: string;
}) =>
{
    const authorizedFetch = useAuthorizedFetch();

    const [exercise, setExercise] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [calculateModalVisible, setCalculateModalVisible] = useState<boolean>(false);
    const [selectedCalculateExercise, setCalculateExercise] = useState<any | null>(null);

    const fetchData = async (alternateExerciseId?: string) =>
    {
        setLoading(true);

        if(!id) {
            setLoading(false);
            return;
        }

        const exerciseId = alternateExerciseId ? alternateExerciseId : exercise_id;
        const response = await authorizedFetch('GET', `exercise/get?workout_id=${id}&exercise_id=${exerciseId}`);

        if(response.ok) {
            setExercise(response.body?.exercise ?? null);
        }

        setLoading(false);
    };

    const switchToAlternateExercise = async (alternateExerciseId: string) =>
        await fetchData(alternateExerciseId);

    useEffect(() => {
        fetchData().then();
    }, []);

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

    const [selectedBodyPart, setSelectedBodyPart] = useState<any | null>(null);
    const [selectedPainExertion, setSelectedPainExertion] = useState<number>(3);
    const [reportPainStep, setReportPainStep] = useState<number>(1);
    const [reportPainModalVisible, setReportPainModalVisible] = useState<boolean>(false);

    const exertions = [
        { label: '1 Minimal Pain', value: 1, description: 'Very light discomfort. You feel it, but it doesn\'t affect your movement or confidence.' },
        { label: '2 Mild Pain', value: 2, description: 'Uncomfortable but easy to train through. You notice it in specific movements, but your technique stays normal.' },
        { label: '3 Moderate Pain', value: 3, description: 'Pain that makes you change something. You can still train, but you adjust the way you move to avoid the feeling. Pain shows during exercise, not at rest.' },
        { label: '4 High Pain', value: 4, description: 'Movement becomes difficult. You avoid certain movements, compensate, or lose clean technique. Pain is present during and after the session.' },
        { label: '5 Severe Pain', value: 5, description: 'Sharp pain that stops activity. You cannot use the area without immediate discomfort. Pain affects daily activities, not just training.' },
    ];

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
    const modalityData = exercise?.modality_data;
    console.log(modalityData);

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
            {exercise?.gif_path ?
                <Image
                    source={{ uri: exercise.gif_path }}
                    style={styles.mainImageStyles}
                /> :
                <Image
                    source={require('@/assets/images/card-image-example-two.png')}
                    style={styles.mainImageStyles}
                />
            }

            <View style={styles.mainContainer}>
                <TextBold
                    style={styles.mainText}
                    ellipsizeMode='tail'
                    numberOfLines={2}
                >
                    {exercise?.name}
                </TextBold>

                {exercise?.description &&
                    <NeutralCard style={{ marginBottom: 24 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 11,
                                marginBottom: 8
                            }}
                        >
                            <Image
                                source={require('@/assets/images/info-tooltip.png')}
                                style={{ width: 18, height: 18 }}
                            />

                            {exercise?.modality && exercise?.modality !== 'repetition-based' &&
                                <Text
                                    fontFamily='CeraCY-Regular'
                                    style={{
                                        color: '#FFFFFF',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {exercise.modality.replace(/-/g, ' ')}
                                </Text>
                            }
                        </View>

                        <Text
                            style={{ color: '#DFDFDF' }}
                            fontFamily='CeraCY-Regular'
                        >
                            {exercise?.description}
                        </Text>
                    </NeutralCard>
                }

                {exercise?.modality === 'repetition-based' &&
                    <View style={styles.cardMainContainer}>
                        <Text style={styles.cardMainText}>in Today’s workout</Text>

                        {exercise?.lower_intensity &&
                            <View
                                style={{
                                    backgroundColor: '#404518',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginBottom: 8,
                                    alignSelf: 'flex-start'
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/lower-intensity-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                />

                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    fontFamily={'CeraCY-Regular'}
                                    style={{
                                        fontSize: 16,
                                        lineHeight: 16,
                                        color: '#FFFFFF'
                                    }}
                                >
                                    Lower intensity
                                </Text>
                            </View>
                        }

                        {exercise?.alternative_exercise &&
                            <View
                                style={{
                                    backgroundColor: '#404518',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    flexDirection: 'row',
                                    gap: 6,
                                    alignItems: 'center',
                                    marginBottom: 8,
                                    alignSelf: 'flex-start'
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/arrows-icon.png')}
                                    style={{ width: 12, height: 12 }}
                                />

                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    fontFamily={'CeraCY-Regular'}
                                    style={{
                                        fontSize: 16,
                                        lineHeight: 16,
                                        color: '#FFFFFF'
                                    }}
                                >
                                    Alternative
                                </Text>
                            </View>
                        }

                        {exercise?.calculated_sets.length === 0 ?
                            <View style={styles.cardInnerContainer}>
                                <View>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                         {exercise?.modality_data?.sets ?
                                            exercise?.modality_data?.sets :
                                            exercise?.calculated_sets.length === 0 ? '?' : exercise?.calculated_sets.length
                                         }
                                    </Text>
                                </View>

                                <View>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                    <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                        {exercise?.modality_data?.reps ?
                                            exercise?.modality_data?.reps :
                                            exercise?.calculated_sets.length === 0 ? '?' : exercise?.calculated_sets.length
                                        }
                                    </Text>
                                </View>
                               {
                                 !(
                                   Number(exercise?.is_body_weight) === 1 &&
                                   exercise?.modality_data?.sets != null &&
                                   exercise?.modality_data?.reps != null
                                 ) && (
                                   <View>
                                     <Text fontFamily="CeraCY-Regular" style={styles.cardText}>
                                       Weight
                                     </Text>
                                     <Text fontFamily="CeraCY-Regular" style={styles.cardText}>
                                       {(exercise?.calculated_sets?.length ?? 0) === 0
                                         ? '?'
                                         : `${exercise?.calculated_sets?.[0]?.weight ?? '?'} KG`}
                                     </Text>
                                   </View>
                                 )
                               }



                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.buttonImageContainer}
                                >
                                    {/*TODO::This is removed because no action provided from BE*/}
                                    {/*<Image*/}
                                    {/*    source={require('@/assets/images/line-dots.png')}*/}
                                    {/*    style={{ width: 18, height: 15 }}*/}
                                    {/*/>*/}
                                </TouchableOpacity>
                            </View> :
                            <View>
                                {exercise?.calculated_sets.map((calculated_set: any, index: number) =>
                                    <View
                                        style={styles.cardInnerContainer}
                                        key={index}
                                    >
                                        <View>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Sets</Text>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                {index + 1}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Reps</Text>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                {calculated_set?.reps || '?'}
                                            </Text>
                                        </View>

                                        <View>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>Weight</Text>
                                            <Text fontFamily='CeraCY-Regular' style={styles.cardText}>
                                                {`${calculated_set?.weight} KG` || '?'}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        }
                        {
                          exercise?.modality === 'repetition-based' &&
                          (exercise?.calculated_sets?.length ?? 0) === 0 &&
                          (
                            Number(exercise?.is_body_weight) === 0 ||
                            (
                              Number(exercise?.is_body_weight) === 1 &&
                              exercise?.modality_data?.reps == null
                            )
                          ) && (
                            <View style={{ marginBottom: 24 }}>
                              <PolygonButtonCustom
                                text="Let’s calculate this"
                                style={{
                                  width: '80%',
                                  marginTop: 16
                                }}
                                onPress={() => openCalculateModal(exercise ?? null)}
                              />
                            </View>
                          )
                        }

                    </View>
                }
                {exercise?.modality === 'time-based' && modalityData && (
                  <View style={styles.cardMainContainer}>
                    <Text style={styles.cardMainText}>in Today’s workout</Text>

                    {/* MODALITY NAME */}
                    <Text
                      style={{
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}
                    >
                      {modalityData.modality.replace(/-/g, ' ')}
                    </Text>

                    {/* SETS + TIME */}
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 16,
                        alignItems: 'center',
                      }}
                    >
                      {/* SETS */}
                      <Text
                        style={{
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        sets: {modalityData.sets ?? '?'}
                      </Text>

                      {/* TIME */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Image
                          source={require('@/assets/images/time-icon.png')}
                          style={{ width: 16, height: 16 }}
                        />

                        <Text
                          style={{
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                          }}
                        >
                          {modalityData.reps ?? '?'} {modalityData.reps_unit ?? ''}
                        </Text>

                        {modalityData.unilateral === 1 && (
                        <View
                          style={{
                            marginLeft: 8,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            backgroundColor: '#404518',
                          }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                            unilateral
                          </Text>
                        </View>
                      )}
                      </View>
                    </View>

                    {/* UNILATERAL */}

                  </View>
                )}

                {exercise?.modality === 'as-many-rounds' && modalityData && (
                                  <View style={styles.cardMainContainer}>
                                    <Text style={styles.cardMainText}>in Today’s workout</Text>

                                    {/* MODALITY NAME */}
                                    <Text
                                      style={{
                                        color: '#FFFFFF',
                                        textTransform: 'uppercase',
                                        marginBottom: 8,
                                      }}
                                    >
                                      as many rounds as possible
                                    </Text>

                                    {/* duration + TIME */}
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        gap: 16,
                                        alignItems: 'center',
                                      }}
                                    >
                                      {/* TIME */}
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          gap: 6,
                                        }}
                                      >
                                        <Image
                                          source={require('@/assets/images/time-icon.png')}
                                          style={{ width: 16, height: 16 }}
                                        />

                                        <Text
                                          style={{
                                            color: '#FFFFFF',
                                            textTransform: 'uppercase',
                                          }}
                                        >
                                          {modalityData.duration ?? '?'} {modalityData.duration_unit ?? ''}
                                        </Text>

                                        {modalityData.unilateral === 1 && (
                                        <View
                                          style={{
                                            marginLeft: 8,
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 4,
                                            backgroundColor: '#404518',
                                          }}
                                        >
                                          <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                                            unilateral
                                          </Text>
                                        </View>
                                      )}
                                      </View>
                                    </View>

                                  </View>
                                )}



                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.buttonContainer}
                        onPress={() => setReportPainModalVisible(true)}
                    >
                        <Image
                            source={require('@/assets/images/bolt-icon.png')}
                            style={{ width: 16, height: 16 }}
                        />

                        <Text style={styles.buttonText}>
                            Report Pain
                        </Text>
                    </TouchableOpacity>

                    {exercise?.alternative_exercise &&
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.buttonContainer}
                            onPress={() => switchToAlternateExercise(exercise?.alternative_exercise?.id)}
                        >
                            <Image
                                source={require('@/assets/images/horizontal-arrows.png')}
                                style={{ width: 16, height: 16 }}
                            />

                            <Text style={styles.buttonText}>
                                Switch to Alternative
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>

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
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end'
                                        }}>
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
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end'
                                        }}>
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
                                        <ScrollView contentContainerStyle={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end'
                                        }}>
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
                modalVisible={reportPainModalVisible}
                setModalVisible={() => closeReportPainModal()}
            >
                {renderReportPain()}
            </MainModal>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
    mainImageStyles: {
        height: 400,
        width: '100%',
        marginBottom: 24,
        objectFit: 'contain'
    },
    mainContainer: {
        marginBottom: 24,
        paddingHorizontal: 24
    },
    mainText: {
        fontSize: 32,
        lineHeight: 32,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        marginBottom: 24
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8
    },
    buttonText: {
        textTransform: 'uppercase',
        color: '#FFFFFF',
        marginBottom: 32,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 16,
        fontWeight: 500
    },
    cardMainContainer: {
        borderColor: '#464646',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderStyle: 'solid',
        marginBottom: 56
    },
    cardMainText: {
        color: '#FFFFFF',
        marginBottom: 8,
        marginTop: 24
    },
    cardInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8
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
});

export default ExercisePage;