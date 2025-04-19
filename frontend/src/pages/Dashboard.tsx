import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Dns as CpuIcon,
} from '@mui/icons-material';
import { RootState } from '../types/store';
import { VM, VMType } from '../types';

interface ResourceTotals {
  cpuCores: number;
  memoryMB: number;
  diskGB: number;
  runningVMs: number;
}

const Dashboard = () => {
  const { vms } = useSelector((state: RootState) => state.vm);
  const { user } = useSelector((state: RootState) => state.auth);

  // Calculate resource usage
  const totalResources = vms.reduce(
    (acc: ResourceTotals, vm: VM): ResourceTotals => {
      acc.cpuCores += vm.cpu_cores;
      acc.memoryMB += vm.memory_mb;
      acc.diskGB += vm.disk_size;
      acc.runningVMs += vm.status === 'RUNNING' ? 1 : 0;
      return acc;
    },
    { cpuCores: 0, memoryMB: 0, diskGB: 0, runningVMs: 0 } as ResourceTotals
  );

  const resourceCards = [
    {
      title: 'CPU Cores',
      value: totalResources.cpuCores,
      icon: <CpuIcon sx={{ fontSize: 40 }} color="primary" />,
    },
    {
      title: 'Memory',
      value: `${(totalResources.memoryMB / 1024).toFixed(1)} GB`,
      icon: <MemoryIcon sx={{ fontSize: 40 }} color="primary" />,
    },
    {
      title: 'Storage',
      value: `${totalResources.diskGB} GB`,
      icon: <StorageIcon sx={{ fontSize: 40 }} color="primary" />,
    },
  ];

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Resource Usage Cards */}
        {resourceCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* VM Status Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Virtual Machines Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography color="textSecondary">Total VMs</Typography>
                  <Typography variant="h6">{vms.length}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography color="textSecondary">Running VMs</Typography>
                  <Typography variant="h6">
                    {totalResources.runningVMs}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography color="textSecondary">Stopped VMs</Typography>
                  <Typography variant="h6">
                    {vms.filter((vm: VM) => vm.status === 'STOPPED').length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography color="textSecondary">VM Types</Typography>
                  <Typography variant="h6">
                    KVM:{' '}
                    {vms.filter((vm: VM) => vm.vm_type === VMType.KVM).length}
                    {' / '}
                    LXC:{' '}
                    {vms.filter((vm: VM) => vm.vm_type === VMType.LXC).length}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
