import Text from '@/components/Text';
import TextBold from '@/components/TextBold';
import MainModal from '@/components/MainModal';
import PolygonButtonCustom from '@/components/PolygonButtonCustom';
import RadioButton from '@/components/RadioButton';
import Loader from '@/components/Loader';

import asyncStorage from '@/lib/asyncStorage';
import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';

import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

const WeekActivityCalendar = () =>
{
    const router = useRouter();
    const authorizedFetch = useAuthorizedFetch();
    const { getUserData } = asyncStorage();

    const [loading, setLoading] = useState<boolean>(false);
    const [currentWeek, setCurrentWeek] = useState<any>(null);
    const [previousWeek, setPreviousWeek] = useState<any>(null);

    const [currentWeekCount, setCurrentWeekCount] = useState<number>(0);
    const [previousWeekCount, setPreviousWeekCount] = useState<number>(0);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [completedWorkouts, setCompletedWorkouts] = useState<any[]>([]);

    const [missingActivityModalVisible, setMissingActivityModalVisible] = useState<boolean>(false);
    const [missingActivityData, setMissingActivityData] = useState<any[]>([]);
    const [selectedReason, setSelectedReason] = useState<number | null>(null);

    const fetchMissingActivity = async () =>
    {
        const response = await authorizedFetch('GET', `missing-activity-reasons`);

        if(response.ok) {
            setMissingActivityData(response?.body?.data);
            setMissingActivityModalVisible(true);
        }
    };

    const saveMissingActivity = async () =>
    {
        setLoading(true);

        const user = await getUserData();
        if(!user) {
            setLoading(false);
            return;
        }

        const response = await authorizedFetch('POST', `user-missing-activity`, {
            user_id: 16,
            missing_activity_reason_id: selectedReason
        });

        if(response.ok) {
            setSelectedReason(null);
            setMissingActivityModalVisible(false);
            router.navigate('/(tabs)');
        }

        setLoading(false);
    };

    const countCompletedWorkouts = (week: any) =>
    {
        if (!week?.days) return 0;

        return week.days.reduce((count: number, day: any) => {
            return count + (day.has_completed_workout ? 1 : 0);
        }, 0);
    };

    const fetchData = async () =>
    {
        const response = await authorizedFetch('GET', `workouts/calendar`);

        if(response.ok) {
            const {
                current_week,
                previous_week
            } = response?.body;

            setCurrentWeek(current_week);
            setPreviousWeek(previous_week);

            setCurrentWeekCount(countCompletedWorkouts(current_week));
            setPreviousWeekCount(countCompletedWorkouts(previous_week));
        }
    };

    const openHistoryModal = async () =>
    {
        const response = await authorizedFetch('GET', `workouts/completed`);

        if(response.ok) {
            setCompletedWorkouts(response?.body?.data);
            setModalVisible(true);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    const getDayAbbreviation = (dateString: string) =>
    {
        const weekDays: Day[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

        const date = new Date(dateString);
        const dayIndex = (date.getDay() + 6) % 7;

        return weekDays[dayIndex];
    };

    const isToday = (dateString: string) =>
    {
        const date = new Date(dateString);
        const today = new Date();

        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const todayDate = () =>
    {
        const today = new Date();

        return today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    if(loading)
        return <Loader />;

    return (
        <View>
            <MainModal
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextBold
                        style={{
                            color: '#FFFFFF',
                            fontSize: 26,
                            lineHeight: 26,
                            textAlign: 'center',
                            marginBottom: 30
                        }}
                    >
                        All Time Completed Workouts
                    </TextBold>

                    <ScrollView>
                        {completedWorkouts?.map((completedWorkout: any, index: number) =>
                            <Text
                                key={index}
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    lineHeight: 16,
                                    textAlign: 'left',
                                    paddingBottom: 16,
                                    marginBottom: 16,
                                    textTransform: 'uppercase',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#FFFFFF'
                                }}
                            >
                                {index + 1}: {completedWorkout?.workout_name} - {completedWorkout?.date} / {completedWorkout?.time}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </MainModal>

            <MainModal
                modalVisible={missingActivityModalVisible}
                setModalVisible={() => {
                    setSelectedReason(null);
                    setMissingActivityModalVisible(false);
                }}
            >
                <View>
                    <View>
                        <TextBold
                            style={{
                                color: '#FFFFFF',
                                fontSize: 26,
                                lineHeight: 26,
                                textAlign: 'center',
                                marginBottom: 30
                            }}
                        >
                            Activity missing
                        </TextBold>

                        <View
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 16,
                                backgroundColor: '#242424',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 56
                            }}
                        >
                            <View
                                style={{
                                    width: '25%'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16,
                                        opacity: 0.5,
                                        textAlign: 'center'
                                    }}
                                    fontFamily={'CeraCY-Regular'}
                                >
                                    Last seen
                                </Text>

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    {missingActivityData?.last_seen ?? '_'}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '50%'
                                }}
                            >
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#FF9898',
                                        borderStyle: 'dashed',
                                        width: '30%',
                                        position: 'relative',
                                        top: '-12%',
                                        left: '-8%'
                                    }}
                                >
                                </View>
                                <Text
                                    style={{
                                        color: '#FF9898',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    ?
                                </Text>
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#FF9898',
                                        borderStyle: 'dashed',
                                        width: '30%',
                                        position: 'relative',
                                        top: '-12%',
                                        left: '8%'
                                    }}
                                >
                                </View>
                            </View>

                            <View
                                style={{
                                    width: '25%'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16,
                                        opacity: 0.5,
                                        textAlign: 'center'
                                    }}
                                    fontFamily={'CeraCY-Regular'}
                                >
                                    Today
                                </Text>

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                        lineHeight: 16,
                                        marginBottom: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    {todayDate()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 16,
                                lineHeight: 16,
                                marginBottom: 16
                            }}
                        >
                            Choose one
                        </Text>

                        <ScrollView
                            style={{
                                maxHeight: 300
                            }}
                        >
                            {missingActivityData?.map((data: any) =>
                                <RadioButton
                                    key={data?.id}
                                    text={data?.title}
                                    isSelected={selectedReason === data?.id}
                                    onPress={() => setSelectedReason(data?.id)}
                                />
                            )}
                        </ScrollView>

                        {selectedReason &&
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    marginTop: 30
                                }}
                            >
                                <PolygonButtonCustom
                                    text='Submit'
                                    style={{ maxWidth: 120 }}
                                    onPress={() => saveMissingActivity()}
                                />
                            </View>
                        }
                    </View>
                </View>
            </MainModal>

            <View style={styles.seeHistoryContainer}>
                <Text
                    fontFamily='CeraCY-Regular'
                    style={styles.finishedWorkoutsText}
                >
                    {currentWeekCount + previousWeekCount} Finished workouts
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => openHistoryModal()}
                >
                    <Text style={styles.noActivityEnterText}>
                        See History
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainWeekDayContainer}>
                <View
                    style={{
                        position: 'relative'
                    }}
                >
                    {previousWeekCount === 0 &&
                        <View style={styles.noActivityContainer}>
                            <View style={styles.noActivityContainerInner}>
                                <Text style={styles.noActivityText}>
                                    Any physical activity?
                                </Text>

                                <Image
                                    source={require('@/assets/images/info-tooltip.png')}
                                    style={{ width: 18, height: 18 }}
                                />
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    width: '20%'
                                }}
                                onPress={async () => await fetchMissingActivity()}
                            >
                                <Text style={styles.noActivityEnterText}>
                                    Enter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={styles.weekDayParentContainer}>
                        <View style={styles.weekContainer}>
                            <TextBold style={styles.weekText}>
                                Last Week
                            </TextBold>

                            <TextBold style={previousWeekCount > 0 ? styles.weekText : styles.weekTextRed}>
                                {previousWeekCount}/7
                            </TextBold>
                        </View>

                        {previousWeekCount > 0 ?
                            <>
                                {previousWeek?.days.map((weekDay: any, index: number) =>
                                    <View
                                        key={index}
                                        style={styles.weekDayContainer}
                                    >
                                        {weekDay.has_completed_workout &&
                                            <Image
                                                source={require('@/assets/images/checked-icon.png')}
                                                style={styles.weekDayImage}
                                            />
                                        }

                                        {weekDay?.rehab && !weekDay.has_completed_workout &&
                                            <Image
                                                source={require('@/assets/images/cross-icon.png')}
                                                style={{
                                                    width: 13,
                                                    height: 13,
                                                    objectFit: 'contain',
                                                    marginBottom: 11
                                                }}
                                            />
                                        }

                                        <Text
                                            fontFamily='CeraCY-Regular'
                                            style={styles.weekDayText}
                                        >
                                            {getDayAbbreviation(weekDay?.date)}
                                        </Text>
                                    </View>
                                )}
                            </> :
                            <>
                                {previousWeek?.days.map((_: any, index: number) =>
                                    <View
                                        key={index}
                                        style={styles.weekDayContainerDark}
                                    >
                                    </View>
                                )}
                            </>
                        }
                    </View>
                </View>

                <View style={styles.weekDayParentContainer}>
                    <View style={styles.weekContainer}>
                        <TextBold style={styles.weekText}>
                            This Week
                        </TextBold>

                        <TextBold style={styles.weekText}>
                            {currentWeekCount}/7
                        </TextBold>
                    </View>

                    {currentWeekCount > 0 ?
                        <>
                            {currentWeek?.days.map((weekDay: any, index: number) =>
                                <View
                                    key={index}
                                    style={[
                                        styles.weekDayContainer,
                                        isToday(weekDay?.date) && { backgroundColor: '#656C26' }
                                    ]}
                                >
                                    {weekDay.has_completed_workout &&
                                        <Image
                                            source={require('@/assets/images/checked-icon.png')}
                                            style={styles.weekDayImage}
                                        />
                                    }

                                    {weekDay?.rehab && !weekDay.has_completed_workout &&
                                        <Image
                                            source={require('@/assets/images/cross-icon.png')}
                                            style={{
                                                width: 13,
                                                height: 13,
                                                objectFit: 'contain',
                                                marginBottom: 11
                                            }}
                                        />
                                    }

                                    <Text
                                        fontFamily='CeraCY-Regular'
                                        style={styles.weekDayText}
                                    >
                                        {getDayAbbreviation(weekDay?.date)}
                                    </Text>
                                </View>
                            )}
                        </> :
                        <>
                            {currentWeek?.days.map((_: any, index: number) =>
                                <View
                                    key={index}
                                    style={styles.weekDayContainerDark}
                                >
                                </View>
                            )}
                        </>
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    finishedWorkoutsText: {
        fontSize: 16,
        lineHeight: 16,
        color: '#8F8F8F'
    },
    mainWeekDayContainer: {
        flexDirection: 'column',
        gap: 8
    },
    weekDayParentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    weekDayContainer: {
        height: 52,
        backgroundColor: '#242424',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 7,
        minWidth: 33
    },
    weekDayContainerDark: {
        height: 52,
        backgroundColor: '#1B1B1B',
        paddingVertical: 8,
        paddingHorizontal: 7,
        minWidth: 33
    },
    weekDayImage: {
        width: 12,
        height: 9,
        marginBottom: 11
    },
    weekDayText: {
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 12
    },
    weekContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        maxWidth: 33
    },
    weekText: {
        color: '#8F8F8F',
        fontSize: 10,
        lineHeight: 10,
        textTransform: 'uppercase'
    },
    weekTextRed: {
        color: '#EF6262',
        fontSize: 10,
        lineHeight: 10,
        textTransform: 'uppercase'
    },
    noActivityContainer: {
        backgroundColor: '#EF626266',
        paddingHorizontal: 8,
        paddingVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 265,
        position: 'absolute',
        top: '50%',
        left: '58%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 1
    },
    noActivityContainerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%'
    },
    noActivityText: {
        color: '#CB6C6C',
        fontSize: 14,
        marginRight: 4
    },
    noActivityEnterText: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontSize: 14,
    },
    seeHistoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    }
});

export default WeekActivityCalendar;
