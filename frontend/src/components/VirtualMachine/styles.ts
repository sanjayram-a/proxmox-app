import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material';

// Card Styles
export const vmCardStyles = (theme: Theme) => ({
  root: {
    position: 'relative',
    transition: theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  },
  content: {
    paddingBottom: theme.spacing(1),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  resourceMetrics: {
    marginBottom: theme.spacing(2),
  },
  actions: {
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Stats Styles
export const vmStatsStyles = (theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  chartContainer: {
    height: 200,
    marginBottom: theme.spacing(2),
  },
  metricsGrid: {
    marginBottom: theme.spacing(3),
  },
  metric: {
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: theme.shape.borderRadius,
  },
  metricValue: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
  },
});

// Console Viewer Styles
export const consoleViewerStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    padding: theme.spacing(0.5),
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    gap: theme.spacing(0.5),
  },
});

// Actions Menu Styles
export const vmActionsStyles = (theme: Theme) => ({
  menuButton: {
    marginLeft: 'auto',
  },
  menu: {
    '& .MuiPaper-root': {
      minWidth: 200,
    },
  },
  menuItem: {
    gap: theme.spacing(1),
  },
  icon: {
    minWidth: 'auto',
  },
  buttonGroup: {
    '& .MuiButtonBase-root': {
      padding: theme.spacing(1),
    },
  },
  statusIndicator: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
});

// Create Dialog Styles
export const createDialogStyles = (theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  section: {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  actions: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
});
