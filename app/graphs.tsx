import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Graphs = () => {
  // Arbitrary data for the bar chart
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
      },
    ],
  };

  // Arbitrary data for the line chart
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Bar Chart for Section 2 */}
      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          width={screenWidth - 40} // from react-native
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {/* Line Chart for Section 3 */}
      <View style={styles.chartContainer}>
        <LineChart
          data={lineData}
          width={screenWidth - 40} // from react-native
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
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#e2a67d',
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

export default Graphs;
