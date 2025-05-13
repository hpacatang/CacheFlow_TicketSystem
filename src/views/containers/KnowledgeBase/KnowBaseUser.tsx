import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppBar from '../../components/AppBar';
import DrawerHeader from '../../components/DrawerHeader';
import Main from '../../components/Main';
import {
  Button,
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
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import FeedbackIcon from '@mui/icons-material/Feedback';
import './KnowBase.css';

// Define a type for the articles
interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  lastUpdated: string;
  body?: string; // Optional property for the article body
}

const KnowBaseUser = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch articles from the backend
  useEffect(() => {
    axios.get('http://localhost:3001/articles')
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedArticle(null);
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
          <h3 className="sidebar-title">User</h3>
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
        <div className="knowledge-base-container" 
        style={{width: '100%',
          maxWidth: '1200px',
          minWidth: '1000px', 
          margin: '0 auto',  
          padding: '20px',
          overflow: 'auto', 
        }}>
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
                {articles.map((article) => (
                  <TableRow key={article.id}>
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

        {/* VIEW ARTICLE MODAL */}
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
          </DialogContent>
        </Dialog>
      </Main>
    </div>
  );
};

export default KnowBaseUser;
