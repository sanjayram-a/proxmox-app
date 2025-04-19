import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  // Removed useTheme as it's not used
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Computer,
  Person,
  Logout as LogoutIcon, // Renamed to avoid conflict with the action
} from '@mui/icons-material';
// Removed plain useDispatch
// FIX: Import the typed hook
import { useAppDispatch } from '../store/hooks'; // Adjust path if needed
import { logout } from '../store/slices/authSlice'; // Keep this import

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const theme = useTheme(); // Removed unused theme
  const navigate = useNavigate();
  // FIX: Use the typed dispatch hook
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false); // Close drawer on navigation
  };

  const handleLogout = () => {
    // FIX: This dispatch call should now be type-safe
    dispatch(logout());
    navigate('/login'); // Redirect after dispatching logout
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Virtual Machines', icon: <Computer />, path: '/vms' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Lab Management {/* Consider making this dynamic or a constant */}
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            // Use component="a" and href for semantic correctness if possible,
            // or keep button and onClick for SPA navigation
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            {/* FIX: Use renamed icon */}
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Lab Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders" // Added aria-label
      >
        {/* Temporary Drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Permanent Drawer for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open // Permanent drawer is always open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Necessary to offset content below AppBar */}
        <Outlet /> {/* Renders the matched child route component */}
      </Box>
    </Box>
  );
};

export default Layout;
