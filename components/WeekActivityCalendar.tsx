import Text from '@/components/Text';
import TextBold from '@/components/TextBold';

import { Image } from 'expo-image';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from "react";

type Day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
const weekDays: Day[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const WeekActivityCalendar = () =>
{
    return (
        <View>
            <View style={styles.seeHistoryContainer}>
                <Text
                    fontFamily='CeraCY-Regular'
                    style={styles.finishedWorkoutsText}
                >
                    12 Finished workouts
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
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

                    <View style={styles.weekDayParentContainer}>
                        <View style={styles.weekContainer}>
                            <TextBold style={styles.weekText}>
                                Last Week
                            </TextBold>

                            <TextBold style={styles.weekTextRed}>
                                0/3
                            </TextBold>
                        </View>

                        {weekDays.map((_, index) =>
                            <View
                                key={index}
                                style={styles.weekDayContainerDark}
                            >
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.weekDayParentContainer}>
                    <View style={styles.weekContainer}>
                        <TextBold style={styles.weekText}>
                            This Week
                        </TextBold>

                        <TextBold style={styles.weekText}>
                            1/3
                        </TextBold>
                    </View>

                    {weekDays.map((weekDay, index) =>
                        <View
                            key={index}
                            style={styles.weekDayContainer}
                        >
                            {index === 2 &&
                                <Image
                                    source={require('@/assets/images/checked-icon.png')}
                                    style={styles.weekDayImage}
                                />
                            }

                            <Text
                                fontFamily='CeraCY-Regular'
                                style={styles.weekDayText}
                            >
                                {weekDay}
                            </Text>
                        </View>
                    )}
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
