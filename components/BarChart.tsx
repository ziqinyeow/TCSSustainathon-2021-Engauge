import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  title1: string;
  xAxis?: number[];
  yAxis1?: number[];
  title2: string;
  yAxis2?: number[];
}

const BarChart: React.FC<Props> = ({
  title1,
  xAxis,
  yAxis1,
  title2,
  yAxis2,
}) => {
  return (
    <div className="w-full h-full">
      <Bar
        data={{
          labels: xAxis,
          datasets: [
            {
              label: title1,
              data: yAxis1,
              backgroundColor: "#F3F4F6",
            },
            {
              label: title2,
              data: yAxis2,
              backgroundColor: "#E5E7EB",
            },
          ],
        }}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: false,
          //   @ts-ignore
          scale: {
            ticks: { beginAtZero: true },
          },
          legend: {
            labels: {
              fontColor: "orange",
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
