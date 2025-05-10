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
    { title: 'Welcome!', category: 'Sample Category', views: 101010, lastUpdated: '1 Year ago' },
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
            backgroundColor: '#1B65AD',
            color: 'white',
          },
        }}
      >
        <div className="sidebar-header">
        <img src="/cacheflowlogo.png" alt="CacheFlow Logo" className="sidebar-logo" />
          <h3 className="sidebar-title">Support Agent</h3>
        </div>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              component="button"
              key={index}
              sx={{
                backgroundColor: '#1B65AD',
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
              sx={{
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '8px',
                  height: '40px',},
                marginRight: '16px', width: '100%', maxWidth: '500px',
                backgroundColor: 'white',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              className="create-button"
              onClick={handleModalOpen}
            >
              Create Article
            </Button>
          </div>

          <div className="table-container">
            {/* Modal for Create Article */}
            <Dialog
              open={isModalOpen}
              onClose={handleModalClose}
              classes={{ paper: 'custom-modal' }}
              sx={{
                '& .MuiDialog-paper': {
                  width: '900px',
                  maxWidth: '90%',
                  borderRadius: '16px',
                },
              }}
            >
              <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Create Article
                <Button
                  onClick={handleModalClose}
                  sx={{
                    minWidth: 'auto',
                    padding: 0,
                    color: 'black',
                    fontSize: '16px',
                    '&:hover': {
                      color: 'red',
                    },
                  }}
                >
                  ✕
                </Button>
              </DialogTitle>
              <DialogContent>
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  sx={{ marginBottom: '2px' }}
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
                      height: '36px',
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
                  multiline
                  rows={4}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '120px',
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
                    displayEmpty
                    defaultValue=""
                    sx={{
                      borderRadius: '8px',
                      height: '40px',
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
                    <MenuItem value="" disabled>
                      <span style={{ color: 'gray' }}>Select Category</span>
                    </MenuItem>
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                  </Select>
                </FormControl>
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  sx={{ marginBottom: '4px' }}
                >
                  Attachments
                </Typography>
                <div
                  style={{
                    border: '2px dashed black',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    marginBottom: '5px',
                    backgroundColor: '#f9f9f9',
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    console.log('Dropped files:', files);
                  }}
                >
                  Drag and drop files here, or click to upload
                </div>
              </DialogContent>
              <DialogActions>
                {/* <Button onClick={handleModalClose} color="secondary">
                  Cancel
                </Button> */}
                <Button 
                onClick={handleModalClose} 
                color="primary" 
                sx={{
                  backgroundColor: '#1E90FF',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkblue',
                  },
                  display: 'block',
                  margin: '0 auto',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  marginBottom: '10px',
                  fontSize: '16px', 
                }}>
                  Create Article
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
