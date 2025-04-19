import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { VM } from '../../types';
import { formatPercentage } from '../../utils/helpers';
import { CHART_COLORS } from '../../constants';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VMStatsProps {
  vm: VM;
  historicalData?: {
    timestamps: string[];
    cpu: number[];
    memory: number[];
    disk: number[];
  };
  showCharts?: boolean;
}

const VMStats: React.FC<VMStatsProps> = ({
  vm,
  historicalData,
  showCharts = true,
}) => {
  const theme = useTheme();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'linear' as const,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (tickValue: number | string) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };

  const createChartData = (
    label: string,
    data: number[],
    color: string
  ): ChartData<'line'> => ({
    labels: historicalData?.timestamps || [],
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color + '40',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resource Usage
        </Typography>

        <Grid container spacing={3}>
          {/* Current Usage Stats */}
          <Grid item xs={12} md={showCharts ? 4 : 12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                CPU Usage
              </Typography>
              <Typography variant="h4">
                {formatPercentage(vm.cpu_usage)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Memory Usage
              </Typography>
              <Typography variant="h4">
                {formatPercentage(vm.memory_usage)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Disk Usage
              </Typography>
              <Typography variant="h4">
                {formatPercentage(vm.disk_usage)}
              </Typography>
            </Box>
          </Grid>

          {/* Historical Charts */}
          {showCharts && historicalData && (
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {/* CPU Usage Chart */}
                <Grid item xs={12}>
                  <Box sx={{ height: 200 }}>
                    <Line
                      options={chartOptions}
                      data={createChartData(
                        'CPU Usage',
                        historicalData.cpu,
                        CHART_COLORS.CPU
                      )}
                    />
                  </Box>
                </Grid>

                {/* Memory Usage Chart */}
                <Grid item xs={12}>
                  <Box sx={{ height: 200 }}>
                    <Line
                      options={chartOptions}
                      data={createChartData(
                        'Memory Usage',
                        historicalData.memory,
                        CHART_COLORS.MEMORY
                      )}
                    />
                  </Box>
                </Grid>

                {/* Disk Usage Chart */}
                <Grid item xs={12}>
                  <Box sx={{ height: 200 }}>
                    <Line
                      options={chartOptions}
                      data={createChartData(
                        'Disk Usage',
                        historicalData.disk,
                        CHART_COLORS.DISK
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VMStats;
