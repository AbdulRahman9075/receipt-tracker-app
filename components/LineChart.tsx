import { View,Dimensions  } from "react-native";
import {
  LineChart
} from "react-native-chart-kit";
import { colors } from "../assets/styles";


const screenWidth = Dimensions.get("window").width;

type PointsChartProps = {
  labels : string[],
  data: number[],
  currency?: string,
};

export function PointsChart(
  {
    labels,
    data,
    currency
  }: PointsChartProps

) {
  return (
    <View>
        <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  color: (opacity = 50) => `rgba(53, 42,43, ${opacity})`, // optional
                  strokeWidth: 2 // optional
                }
              ],
              
            }
}
            width={screenWidth*0.9}
            height={350}
            yAxisLabel= {currency ?? ''}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundGradientFrom: colors.graphBgColor,
                  backgroundGradientTo: colors.graphBgColor,
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 255) => `rgba(0, 0,0, ${opacity})`,
                style: {
                    borderRadius: 16
                },

                propsForLabels: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#eaff00ff"
                }
                
            }}
            bezier
            style={{
            marginVertical: 8,
            borderRadius: 8,
            padding: 5
            }}
        />
      
    </View>

  );
}


