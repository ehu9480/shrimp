import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { WebSocketContext } from './WebSocketProvider';

const screenWidth = Dimensions.get('window').width;

export default function Graphs (){
    const webSocketContext = useContext(WebSocketContext);

    if (!webSocketContext) {
        return null; // If no WebSocketContext, don't render the chart
    }

    const { data } = webSocketContext;

    // Prepare bar chart data
    const barData = {
        labels: ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'],
        datasets: [
            {
                data: data, // Use the "yes" count array from WebSocket data
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <BarChart
                    data={barData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                />
            </View>
        </View>
    );
};

const chartConfig = {
    backgroundColor: '#e2a67d',
    backgroundGradientFrom: '#b35242',
    backgroundGradientTo: '#e2a67d',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        marginVertical: 10,
    },
    chart: {
        borderRadius: 16,
    },
});
