
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Layers, PieChart as PieChartIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ImpactMetric {
  label: string;
  value: number;
  color: string;
}

interface ImpactMetricsDashboardProps {
  projectMetrics: ImpactMetric[];
  fundingMetrics: ImpactMetric[];
  sdgMetrics: ImpactMetric[];
}

export function ImpactMetricsDashboard({
  projectMetrics,
  fundingMetrics,
  sdgMetrics,
}: ImpactMetricsDashboardProps) {
  // Project metrics chart data
  const projectsChartData = {
    labels: projectMetrics.map((metric) => metric.label),
    datasets: [
      {
        label: "Projects by Category",
        data: projectMetrics.map((metric) => metric.value),
        backgroundColor: projectMetrics.map((metric) => metric.color),
        borderColor: projectMetrics.map((metric) => metric.color),
        borderWidth: 1,
      },
    ],
  };

  // Funding metrics chart data
  const fundingChartData = {
    labels: fundingMetrics.map((metric) => metric.label),
    datasets: [
      {
        label: "Funding Allocation",
        data: fundingMetrics.map((metric) => metric.value),
        backgroundColor: fundingMetrics.map((metric) => metric.color),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  // SDG metrics chart data
  const sdgChartData = {
    labels: sdgMetrics.map((metric) => metric.label),
    datasets: [
      {
        label: "SDG Contributions",
        data: sdgMetrics.map((metric) => metric.value),
        backgroundColor: sdgMetrics.map((metric) => metric.color),
        borderColor: sdgMetrics.map((metric) => metric.color),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-primary" />
          Impact Metrics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects by Category */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Projects by Category
            </h3>
            <div className="h-64">
              <Bar options={barOptions} data={projectsChartData} />
            </div>
          </div>

          {/* Funding Allocation */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-4 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Funding Allocation
            </h3>
            <div className="h-64">
              <Pie options={pieOptions} data={fundingChartData} />
            </div>
          </div>

          {/* SDG Contributions */}
          <div className="bg-muted/50 p-4 rounded-lg md:col-span-2">
            <h3 className="text-md font-medium mb-4 flex items-center gap-2">
              <ChartBar className="h-4 w-4 text-primary" />
              SDG Contributions
            </h3>
            <div className="h-64">
              <Bar options={barOptions} data={sdgChartData} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
