import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { useAuth } from '../../../contexts/AuthContext';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './KnowBase.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


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
  const { getUserRole } = useAuth();
  const userRole = getUserRole();
  const canManageKnowledgeBase = userRole === 'agent' || userRole === 'admin' || userRole === 'superadmin';
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); 
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
    // Fetch articles from backend
    axios.get('/api/article')
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

  const handleDeleteConfirmModalOpen = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteConfirmModalClose = () => {
    setIsDeleteConfirmModalOpen(false);
  };

  // Update the newArticle state when the user types in the modal's input fields.
  const handleNewArticleChange = (field: keyof Article, value: string) => {
    setNewArticle({ ...newArticle, [field]: value });
  };

  // Add a function to add the new article to the articles array.
  const handleCreateArticle = () => {
    console.log('Create Article button clicked');

    // Generate a unique integer ID based on the current articles
    const newId = articles.length > 0 ? Math.max(...articles.map(article => parseInt(article.id))) + 1 : 1;

    const newArticleWithId = {
      ...newArticle,
      id: newId, // Use the generated integer ID
      views: 0,
      lastUpdated: new Date().toISOString(), // Use ISO format for the date
    };

    console.log('New article data:', newArticleWithId);

    axios.post('/api/article', newArticleWithId)
      .then((response) => {
        console.log('Article created successfully:', response.data);
        setArticles([...articles, response.data]);
        setIsModalOpen(false);
        setNewArticle({ id: uuidv4(), title: '', category: '', views: 0, lastUpdated: new Date().toLocaleDateString(), body: '' }); // Reset the form
      })
      .catch((error) => {
        console.error('Error creating article:', error.response || error.message);
      });
  };

  //Update article function
  const handleUpdateArticle = () => {
    if (selectedArticle) {
      const updatedArticle = { ...selectedArticle, lastUpdated: new Date().toLocaleDateString() };
      axios.put(`/api/article/${selectedArticle.id}`, updatedArticle)
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
      handleDeleteConfirmModalOpen(); // Open confirmation modal
    }
  };

  const confirmDeleteArticle = () => {
    if (selectedArticle) {
      axios.delete(`/api/article/${selectedArticle.id}`)
        .then(() => {
          setArticles(articles.filter((article) => article.id !== selectedArticle.id));
          setIsEditModalOpen(false); // Close edit modal if open
          setSelectedArticle(null);
          handleDeleteConfirmModalClose(); // Close confirmation modal
        })
        .catch((error) => {
          console.error('Error deleting article:', error);
          handleDeleteConfirmModalClose(); // Close confirmation modal on error too
        });
    }
  };

  const handleSelectedArticleChange = (field: keyof Article, value: string) => {
    if (selectedArticle) {
      setSelectedArticle({ ...selectedArticle, [field]: value });
    }
  };

  return (
    <Layout module="knowledgeBase">
      <h1 className="knowledge-base-title">Knowledge Base</h1>
      <div className="knowledge-base-container">
        
        {/* Tabs - Only for agents/admins who can manage */}
        {canManageKnowledgeBase && (
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
        )}

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
          
          {/* Create Article Button - Only for agents/admins who can create */}
          {canManageKnowledgeBase && (
            <Button
              variant="contained"
              color="primary"
              className="create-button"
              onClick={handleModalOpen}
            >
              Create Article
            </Button>
          )}
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
                  
                  {/* Actions column - Only for agents/admins who can edit */}
                  {canManageKnowledgeBase && (
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {articles
                  .filter((article) =>
                    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((article, index) => (
                    <TableRow key={index}>
                      <TableCell
                        onClick={() => handleViewArticle(article)}
                        sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      >
                        {article.title}
                      </TableCell>
                      <TableCell>{article.category}</TableCell>
                      <TableCell>{article.views}</TableCell>
                      <TableCell>{article.lastUpdated.split('T')[0]}</TableCell>
                      
                      {/* Actions - Only for agents/admins who can edit/delete */}
                      {canManageKnowledgeBase && (
                        <TableCell>
                          {/* Edit button */}
                          <Button
                            onClick={() => {
                              setSelectedArticle(article);
                              handleEditModalOpen();
                            }}
                            sx={{
                              minWidth: '50px',
                              padding: '4px',
                              color: 'white',
                              textTransform: 'none',
                              backgroundColor: 'blue',
                              marginRight: '5px',
                              fontWeight: '600',
                              '&:hover': {
                                backgroundColor: 'lightgray',
                                textTransform: 'none',
                              },
                            }}
                          >
                          Edit
                          </Button>

                          {/* Delete button */}
                          <Button
                            onClick={() => {
                              setSelectedArticle(article);
                              handleDeleteArticle();
                            }}
                            sx={{
                              minWidth: '50px',
                              padding: '4px',
                              color: 'white',
                              textTransform: 'none',
                              backgroundColor: 'red',
                              fontWeight: '600',
                              '&:hover': {
                                backgroundColor: 'darkred',
                              },
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      )}
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
            {/* <Button
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
            </Button> */}
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRMATION MODAL */}
        <Dialog
          open={isDeleteConfirmModalOpen}
          onClose={handleDeleteConfirmModalClose}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              maxWidth: '90%',
              borderRadius: '16px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
            Are you sure you want to delete this article?
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center', marginTop: '20px' }}>
            <Button
              onClick={handleDeleteConfirmModalClose}
              sx={{
                color: 'black',
                border: '1px solid black',
                marginRight: '10px',
                padding: '8px 16px',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'lightgray',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteArticle} 
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    </Layout>
  );
};

export default KnowBase;
