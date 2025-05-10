// filepath: d:\CacheFlow_TicketSystem\src\views\containers\KnowledgeBase\KnowBase.tsx
import React, { useState } from 'react';
import AppBar from '../../components/AppBar';
import DrawerHeader from '../../components/DrawerHeader';
import Main from '../../components/Main';
import {
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import FeedbackIcon from '@mui/icons-material/Feedback';
import './KnowBase.css';

const KnowBase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const articles = [
    { title: 'Sample Article', category: 'Sample Category', views: 42069, lastUpdated: '1 Year ago' },
  ];

  const menuItems = [
    { text: 'Ticket Management', icon: <HomeIcon />, textColor: 'white' },
    { text: 'Ticket Assignment', icon: <ArticleIcon />, textColor: 'white' },
    { text: 'Ticket Tracking', icon: <ArticleIcon />, textColor: 'white' },
    { text: 'Notifications', icon: <FeedbackIcon />, textColor: 'white' },
    { text: 'Reporting & Analytics', icon: <FeedbackIcon />, textColor: 'white' },
    { text: 'Knowledge Base', icon: <ArticleIcon />, textColor: 'white' },
    { text: 'Customer Feedback', icon: <FeedbackIcon />, textColor: 'white' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 270,
            boxSizing: 'border-box',
            backgroundColor: '#1976d2',
            color: 'white',
          },
        }}
      >
        <div className="sidebar-header">
        <img src="/cacheflowlogo.png" alt="CacheFlow Logo" className="sidebar-logo" />
          <h3 className="sidebar-title">CacheFlow</h3>
        </div>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              component="button"
              key={index}
              sx={{
                backgroundColor: '#1976d2',
                border: 'none',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  color: 'white',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon> {/* Icon color */}
              <ListItemText
                primary={item.text}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Main style={{ marginLeft: 80 }}>
        <AppBar title="Knowledge Base" />
        <DrawerHeader />
        <h1 className="knowledge-base-title">Knowledge Base</h1>
        <div className="knowledge-base-container">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Knowledge Base Tabs"
            className="tabs-container"
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <Tab
              label="Article"
              className={activeTab === 0 ? 'active-tab' : 'inactive-tab'}
            />
            <Tab
              label="Drafts"
              className={activeTab === 1 ? 'active-tab' : 'inactive-tab'}
            />
            <Tab
              label="Categories"
              className={activeTab === 2 ? 'active-tab' : 'inactive-tab'}
            />
          </Tabs>

          <div className="search-bar">
            <TextField
              placeholder="Search Articles"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: '8px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </div>

          <div className="table-container">
            <div className="create-article-button">
              <Button
                variant="contained"
                color="primary"
                className="create-button"
                onClick={handleModalOpen}
              >
                Create Article
              </Button>
            </div>

            {/* Modal for Create Article */}
            <Dialog
              open={isModalOpen}
              onClose={handleModalClose}
              classes={{ paper: 'custom-modal' }}
            >
              <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px' }}>Create Article</DialogTitle>
              <DialogContent>
                <Typography
                  variant="subtitle1"
                  gutterBottom={false} // Remove extra bottom margin
                  sx={{ marginBottom: '4px' }} // Add a smaller margin
                >
                  Article Title
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': { borderColor: 'black' },
                      '&:hover fieldset': { borderColor: 'black' },
                      '&.Mui-focused fieldset': { borderColor: 'black' },
                    },
                    marginBottom: '16px',
                  }}
                />
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  sx={{ marginBottom: '4px' }}
                >
                  Body
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': { borderColor: 'black' },
                      '&:hover fieldset': { borderColor: 'black' },
                      '&.Mui-focused fieldset': { borderColor: 'black' },
                    },
                    marginBottom: '16px',
                  }}
                />
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  sx={{ marginBottom: '4px' }}
                >
                  Category
                </Typography>
                <FormControl
                  fullWidth
                  margin="dense"
                  sx={{ marginBottom: '16px' }}
                >
                  <Select
                    defaultValue=""
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black',
                      },
                    }}
                  >
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleModalClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleModalClose} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Article</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categories</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.map((article, index) => (
                  <TableRow key={index}>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.views}</TableCell>
                    <TableCell>{article.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Main>
    </div>
  );
};

export default KnowBase;
