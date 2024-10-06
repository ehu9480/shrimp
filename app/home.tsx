import React, { useRef, useEffect, useState } from 'react';
import { Animated, ScrollView, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Text, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationsComponent, { schedulePushNotification } from './notifications'; // Import the notification function
import { BarChart } from 'react-native-chart-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp, faShrimp } from '@fortawesome/free-solid-svg-icons'; // Import the icons

const { height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type ResultType = {
    data: any;
    prediction: string;
};

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const [cooldown, setCooldown] = useState<number>(0); // Cooldown state
    const [readyForNotification, setReadyForNotification] = useState<boolean>(true); // State to determine when we can send a notification
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true); // State to control notification toggle

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [height * 0.1, 0],
        extrapolate: 'clamp',
    });

    const handleSignOut = () => {
        router.replace('/login');
    };

    const toggleNotifications = () => setNotificationsEnabled((previousState) => !previousState);

    const [data, setData] = useState<number[]>(Array(6).fill(0));
    const [result, setResult] = useState<ResultType | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://10.48.163.223:8080/ws');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (e) => {
            console.log(e.data);
            const receivedData = JSON.parse(e.data);
            setResult({
                data: receivedData.data,
                prediction: receivedData.data === 1 ? '1' : '0',
            });

            // Only send a notification if the cooldown is 0, notifications are enabled, ready for notification, and the data is '1'
            if (notificationsEnabled && receivedData.data === 1 && cooldown === 0 && readyForNotification) {
                schedulePushNotification() // Trigger push notification
                    .then(() => {
                        setCooldown(15);  // Start 15-second cooldown only after sending the notification
                        setReadyForNotification(false);  // Prevent sending another notification until the cooldown finishes
                    })
                    .catch((error) => {
                        console.error('Error sending notification:', error);
                    });
            }

            if (receivedData.data === 1) {
                setData((prevData) => {
                    const newData = [...prevData];
                    newData[newData.length - 1]++;
                    return newData;
                });
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        const interval = setInterval(() => {
            setData((prevData) => {
                const newData = prevData.slice(1);
                newData.push(0);
                return newData;
            });
        }, 10000);

        return () => {
            ws.close();
            clearInterval(interval);
        };
    }, [cooldown, readyForNotification, notificationsEnabled]);

    // Cooldown logic - decrement cooldown every second if greater than 0
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                setCooldown((prev) => prev > 0 ? prev - 1 : 0);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setReadyForNotification(true); // Reset and allow for the next notification once cooldown is 0
        }
    }, [cooldown]);

    const barData = {
        labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'],
        datasets: [
            {
                data: data,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#e2a67d',
        backgroundGradientFrom: '#e2a67d',
        backgroundGradientTo: '#e2a67d',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForLabels: {
            fontSize: 16, 
        },
        barPercentage: .3
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Animated Header */}
            <Animated.View style={[styles.header, { opacity: headerOpacity, height: headerHeight }]}>
                <View style={styles.headerContent}>
                    <Image
                        source={require('../assets/images/shrimp-logo.png')}
                        style={styles.logo}
                    />
                    <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
                        Shrimp
                    </Animated.Text>
                </View>

                <Animated.View style={[styles.signOutContainer, { opacity: headerOpacity }]}>
                    <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* Scrollable content */}
            <Animated.ScrollView
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.sectionLarge}>
                    {result && result.prediction === '1' ? (
                        <View style={styles.resultContainer}>
                            <FontAwesomeIcon icon={faShrimp} style={{ color: "#fb964a" }} size={100} />
                            <Text style={styles.resultText}>You're shrimping!</Text>
                        </View>
                    ) : (
                        <View style={styles.resultContainer}>
                            <FontAwesomeIcon icon={faThumbsUp} style={{ color: "#37c5a9" }} size={100} />
                            <Text style={styles.resultText}>Nice posture!</Text>
                        </View>
                    )}
                    {/* Only show NotificationsComponent if notifications are enabled */}
                    {notificationsEnabled && <NotificationsComponent cooldown={cooldown} />}

                    {/* Notification Toggle */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>Enable Notifications</Text>
                        <Switch
                            onValueChange={toggleNotifications}
                            value={notificationsEnabled}
                            trackColor={{ false: "#d9d9d9", true: "#fb964a" }}
                            thumbColor={notificationsEnabled ? "#b35242" : "#bcbcbc"}
                        />
                    </View>
                </View>
                <View style={styles.graphSection}>
                    <Text style={styles.toggleLabel}>Your Shrimp Count:</Text>
                    <View style={styles.container}>
                        <BarChart
                            data={barData}
                            width={screenWidth * 0.9} // Set the width to 90% of the screen width to create space on both sides
                            height={screenHeight * 0.5} // Adjusted height to reduce cutting off
                            chartConfig={chartConfig}
                            style={styles.chart}
                            fromZero
                            xLabelsOffset={20} // Adjust label position for better alignment
                            yLabelsOffset={25} // Adjust label position for better alignment
                            showValuesOnTopOfBars={true}
                            showBarTops={true}
                        />
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff3e6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff3e6',
        overflow: 'hidden',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#b35242',
    },
    signOutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutButton: {
        backgroundColor: '#b35242',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        paddingVertical: 20,
        backgroundColor: '#fff3e6',
    },
    sectionLarge: {
        height: height * 0.7,
        backgroundColor: '#b35242',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphSection: {
        height: height * 0.7,
        backgroundColor: '#fff3e6',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chart: {
        borderRadius: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    resultContainer: {
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingVertical: 10,
    },
    toggleLabel: {
        fontSize: 16,
        marginRight: 10,
        color: '#fff',
    },
});
