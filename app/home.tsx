import React, { useRef } from 'react';
import { Animated, ScrollView, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationsComponent from './notifications';
import Graphs from './graphs';
import { WebSocketProvider } from './WebSocketProvider'; // Import the WebSocketProvider

const { height } = Dimensions.get('window');

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150], // Start fading after 150 pixels of scroll
        outputRange: [1, 0], // Fully visible to invisible
        extrapolate: 'clamp', // Don't go beyond this range
    });

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 150], // Start reducing height after 150 pixels of scroll
        outputRange: [height * 0.1, 0], // Full height to 0 (disappears)
        extrapolate: 'clamp', // Don't go beyond this range
    });

    const handleSignOut = () => {
        router.replace('/login');
    };

    return (
        <WebSocketProvider>
            <SafeAreaView style={styles.safeArea}>
                {/* Animated Header */}
                <Animated.View style={[styles.header, { opacity: headerOpacity, height: headerHeight }]}>
                    <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
                        Welcome to Shrimp
                    </Animated.Text>

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
                        <Text>Real-time Model Result: Waiting for result...</Text>
                        <NotificationsComponent />
                    </View>

                    <View style={styles.sectionSmall}>
                        <Text style={styles.sectionHeader}>Bar Graph</Text>
                        <View style={styles.graphContainer}>
                            <Graphs />
                        </View>
                    </View>
                </Animated.ScrollView>
            </SafeAreaView>
        </WebSocketProvider>
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
    sectionSmall: {
        height: height * 0.4,
        backgroundColor: '#e2a67d',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'flex-start',
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff3e6',
    },
    graphContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
});