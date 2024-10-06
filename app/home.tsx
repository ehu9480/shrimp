import React, { useRef } from 'react';
import { Animated, ScrollView, Text, View, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationsComponent from './notifications';
import Graphs from './graphs';

const { height } = Dimensions.get('window');

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const router = useRouter();

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
                <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
                    Welcome to Shrimp
                </Animated.Text>

                <Animated.View style={[styles.signOutContainer, { opacity: headerOpacity }]}>
                    <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={styles.sectionLarge}>
                    <Text style={styles.sectionHeader}>Overview</Text>
                    <Text style={styles.sectionContent}>This section provides a broad overview.</Text>

                    <NotificationsComponent />
                </View>

                <View style={styles.sectionSmall}>
                    <Text style={styles.sectionHeader}>Bar Graph</Text>
                    <View style={styles.graphContainer}>
                        {/* <Graphs graphType="bar" /> */}
                    </View>
                </View>

                <View style={styles.sectionSmall}>
                    <Text style={styles.sectionHeader}>Line Graph</Text>
                    <View style={styles.graphContainer}>
                        {/* <Graphs graphType="line" /> */}
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
        fontFamily: 'Pt',
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
    sectionContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#fff3e6',
    },
    graphContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
});
