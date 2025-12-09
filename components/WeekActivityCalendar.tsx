import Text from '@/components/Text';
import TextBold from '@/components/TextBold';

import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import useAuthorizedFetch from '@/hooks/useAuthorizedFetch';

type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

const WeekActivityCalendar = () =>
{
    const authorizedFetch = useAuthorizedFetch();

    const [currentWeek, setCurrentWeek] = useState<any>(null);
    const [previousWeek, setPreviousWeek] = useState<any>(null);

    const [currentWeekCount, setCurrentWeekCount] = useState<number>(0);
    const [previousWeekCount, setPreviousWeekCount] = useState<number>(0);

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

    return (
        <View>
            <View style={styles.seeHistoryContainer}>
                <Text
                    fontFamily='CeraCY-Regular'
                    style={styles.finishedWorkoutsText}
                >
                    {currentWeekCount + previousWeekCount} Finished workouts
                </Text>

                {/* TODO::add this when backend finishes */}
                {/*<TouchableOpacity*/}
                {/*    activeOpacity={0.8}*/}
                {/*>*/}
                {/*    <Text style={styles.noActivityEnterText}>*/}
                {/*        See History*/}
                {/*    </Text>*/}
                {/*</TouchableOpacity>*/}
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

                                        {weekDay?.rehab &&
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

                        <TextBold style={currentWeekCount > 0 ? styles.weekText : styles.weekTextRed}>
                            {currentWeekCount}/7
                        </TextBold>
                    </View>

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
                            >
                                <Text style={styles.noActivityEnterText}>
                                    Enter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {currentWeek > 0 ?
                        <>
                            {currentWeek?.days.map((weekDay: any, index: number) =>
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

                                    {weekDay?.rehab &&
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
