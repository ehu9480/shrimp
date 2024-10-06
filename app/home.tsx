import React, { useRef, useState, useEffect } from 'react';
import { Animated, ScrollView, View, StyleSheet, Dimensions, SafeAreaView, Text } from 'react-native';

const { height, width } = Dimensions.get('window'); // Get screen height and width for sizing the sections

type ModelResult = {
    prediction: string;
};

export default function Home() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [result, setResult] = useState<ModelResult | null>(null);

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

    // useEffect(() => {
    //     const ws = new WebSocket('ws://10.48.163.223:8000');  
    
    //     ws.onopen = () => {
    //       console.log('Connected to the WebSocket server');
    //     };
    
    //     ws.onmessage = (e) => {
    //       const data = JSON.parse(e.data);
    //       setResult(data.result); 
    //     };
    
    //     ws.onerror = (e) => {
    //       console.error('WebSocket error: ', e);
    //     };
    
    //     ws.onclose = (e) => {
    //       console.log('WebSocket connection closed');
    //     };
    
    //     return () => {
    //       ws.close();  
    //     };
    //   }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.header, { opacity: headerOpacity, height: headerHeight }]}>
                <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
                    Welcome to Shrimp
                </Animated.Text>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16} 
            >
                {/* First section - nearly full page */}
                <View style={styles.sectionLarge}>
                    {/* <Text>Shrimping? {result ? result.prediction : 'Waiting for result...'}</Text> */}
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
