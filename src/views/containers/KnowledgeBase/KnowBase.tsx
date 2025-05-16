import React, { useState, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { AgentSidebar } from '../../components/Sidebars/AgentSidebar';

// Define a type for the articles
interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  lastUpdated: string;
  body?: string;
}

const KnowBase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([
    {
      id: uuidv4(),
      title: 'Welcome!',
      category: 'Sample Category',
      views: 101010,
      lastUpdated: '1 Year ago',
      body: 'Welcome to Cache Flow, the smart and reliable ticketing system designed to keep your support process running smoothly. Whether you\'re resolving internal IT issues, handling customer queries, or managing service requests, Cache Flow gives you the tools to stay organized, responsive, and efficient.\n\nThis is the Knowledge Base! Here, you will find a comprehensive collection of articles, guides, and resources designed to help you navigate and make the most of our system. Whether you are looking for troubleshooting tips, detailed explanations, or best practices, we have got you covered. Dive in and explore the wealth of information at your fingertips!',
    },
  ]);
  // State to store the input values for the new article
  const [newArticle, setNewArticle] = useState<Article>({
    id: uuidv4(),
    title: '',
    category: '',
    views: 0,
    lastUpdated: new Date().toLocaleDateString(),
    body: '',
  });

  //Axios and db.json implementation for permanent data storage
  useEffect(() => {
    // Fetch articles from JSON Server
    axios.get('http://localhost:3001/articles')
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
      });
  }, []);

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

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedArticle(null);
  };

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  // Update the newArticle state when the user types in the modal's input fields.
  const handleNewArticleChange = (field: keyof Article, value: string) => {
    setNewArticle({ ...newArticle, [field]: value });
  };

  // Add a function to add the new article to the articles array.
  const handleCreateArticle = () => {
    console.log('Create Article button clicked');
    const newArticleWithId = { ...newArticle, id: uuidv4(), views: 0, lastUpdated: new Date().toLocaleDateString() };
    console.log('New article data:', newArticleWithId);
    axios.post('http://localhost:3001/articles', newArticleWithId)
      .then((response) => {
        console.log('Article created successfully:', response.data);
        setArticles([...articles, response.data]);
        setIsModalOpen(false);
        setNewArticle({ id: uuidv4(), title: '', category: '', views: 0, lastUpdated: '', body: '' }); // Reset the form
      })
      .catch((error) => {
        console.error('Error creating article:', error);
      });
  };

  //Update article function
  const handleUpdateArticle = () => {
    if (selectedArticle) {
      const updatedArticle = { ...selectedArticle, lastUpdated: new Date().toLocaleDateString() };
      axios.put(`http://localhost:3001/articles/${selectedArticle.id}`, updatedArticle)
        .then(() => {
          setArticles(
            articles.map((article) =>
              article.id === selectedArticle.id ? updatedArticle : article
            )
          );
          setIsEditModalOpen(false);
          setSelectedArticle(null);
        })
        .catch((error) => {
          console.error('Error updating article:', error);
        });
    }
  };
  
  const handleDeleteArticle = () => {
    if (selectedArticle) {
      axios.delete(`http://localhost:3001/articles/${selectedArticle.id}`)
        .then(() => {
          setArticles(articles.filter((article) => article.id !== selectedArticle.id));
          setIsEditModalOpen(false);
          setSelectedArticle(null);
        })
        .catch((error) => {
          console.error('Error deleting article:', error);
        });
    }
  };

  const handleSelectedArticleChange = (field: keyof Article, value: string) => {
    if (selectedArticle) {
      setSelectedArticle({ ...selectedArticle, [field]: value });
    }
  };

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
      {/* <Drawer
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
              {/* <ListItemText
                primary={item.text}
              />
            </ListItem>
          ))}
        </List>
      </Drawer> */}
      <AgentSidebar />

      {/* Main Content */}
      
      <Main style={{ marginLeft: 80 }}>
        <AppBar title="Knowledge Base" />
        <DrawerHeader />
        <h1 className="knowledge-base-title">Knowledge Base</h1>
        <div className="knowledge-base-container" style={{ width: '109%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
                  value={newArticle.title}
                  onChange={(e) => handleNewArticleChange('title', e.target.value)}
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
                  value={newArticle.body}
                  onChange={(e) => handleNewArticleChange('body', e.target.value)}
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
                    value={newArticle.category}
                    onChange={(e) => handleNewArticleChange('category', e.target.value)}
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
                <Button 
                onClick={handleCreateArticle} 
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

          {/* KNOWLEDGE BASE TABLE */}
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
                    <TableCell
                      onClick={() => handleViewArticle(article)}
                      sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.views}</TableCell>
                    <TableCell>{article.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* VIEW ARTICLE & EDIT ARTICLE ICON */}
        <Dialog
          open={isViewModalOpen}
          onClose={handleViewModalClose}
          classes={{ paper: 'custom-modal' }}
          sx={{
            '& .MuiDialog-paper': {
              width: '1000px',
              maxWidth: '90%',
              borderRadius: '16px',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectedArticle?.title}
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditModalOpen();
                }}
                sx={{
                  minWidth: 'auto',
                  padding: 0,
                  color: 'black',
                  fontSize: '16px',
                  marginLeft: '8px',
                  '&:hover': {
                    color: 'blue',
                  },
                }}
              >
                ✎ {/* Pen icon */}
              </Button>
            </div>
            <Button
              onClick={handleViewModalClose}
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
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>
              <strong>Category:</strong> {selectedArticle?.category}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>
              <strong>Last Updated:</strong> {selectedArticle?.lastUpdated}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '16px', whiteSpace: 'pre-line' }}>
              {selectedArticle?.body || 'No content available.'}
            </Typography>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <img
                src="/placeholder-image.png"
                alt="Article"
                style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* EDIT ARTICLE MODAL */}
        <Dialog
          open={isEditModalOpen}
          onClose={handleEditModalClose}
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
            Edit Article
            <Button
              onClick={handleEditModalClose}
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
              value={selectedArticle?.title || ''}
              onChange={(e) => handleSelectedArticleChange('title', e.target.value)}
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
              value={selectedArticle?.body || ''}
              onChange={(e) => handleSelectedArticleChange('body', e.target.value)}
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
                value={selectedArticle?.category || ''}
                onChange={(e) => handleSelectedArticleChange('category', e.target.value)}
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
            <Button
              onClick={handleUpdateArticle}
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
              }}
            >
              Update Article
            </Button>
            <Button
              onClick={handleDeleteArticle}
              sx={{
                color: 'red',
                '&:hover': {
                  color: 'darkred',
                },
                display: 'block',
                margin: '0 auto',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textTransform: 'none',
                marginBottom: '10px',
                fontSize: '16px',
              }}
            >
              Delete Article
            </Button>
          </DialogActions>
        </Dialog>
      </Main>
    </div>
  );
};

export default KnowBase;
