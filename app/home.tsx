import React, { useRef } from 'react';
import { Animated, ScrollView, View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

const { height, width } = Dimensions.get('window'); // Get screen height and width for sizing the sections

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;

    // Interpolate the scroll value to create the opacity for the header
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150], // Start fading after 150 pixels of scroll
        outputRange: [1, 0], // Fully visible to invisible
        extrapolate: 'clamp', // Don't go beyond this range
    });

    // Interpolate the scroll value to reduce the height of the header
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 150], // Start reducing height after 150 pixels of scroll
        outputRange: [height * 0.1, 0], // Full height to 0 (disappears)
        extrapolate: 'clamp', // Don't go beyond this range
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Animated Header */}
            <Animated.View style={[styles.header, { opacity: headerOpacity, height: headerHeight }]}>
                <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
                    Welcome to Shrimp
                </Animated.Text>
            </Animated.View>

            {/* Scrollable content */}
            <Animated.ScrollView
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // Native driver doesn't support height and opacity yet
                )}
                scrollEventThrottle={16} // Smooth scrolling updates
            >
                {/* First section - nearly full page */}
                <View style={styles.sectionLarge}>
                    {/* No text content here as requested */}
                </View>

                {/* Second and third sections - smaller vertical boxes */}
                <View style={styles.sectionSmallContainer}>
                    <View style={styles.sectionSmall}>
                        {/* No text content here as requested */}
                    </View>
                    <View style={styles.sectionSmall}>
                        {/* No text content here as requested */}
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff3e6', // Black background color for the whole app
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff3e6', // Header background color
        overflow: 'hidden', // Ensure height shrinkage looks smooth
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#b35242', // White text for the header
        fontFamily: 'Pt', // Softer, rounder font
    },
    container: {
        paddingVertical: 20,
        backgroundColor: '#fff3e6', // Keep the scrollable area black as well
    },
    sectionLarge: {
        height: height * 0.7, // Almost full-screen height for the first section
        backgroundColor: '#b35242',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
    },
    sectionSmallContainer: {
        marginHorizontal: 20,
    },
    sectionSmall: {
        height: height * 0.4, // Smaller height for the second and third sections (20% of screen height)
        backgroundColor: '#e2a67d',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'center',
    },
});
