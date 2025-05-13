import React, { useState } from 'react';
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
  title: string;
  category: string;
  views: number;
  lastUpdated: string;
  body?: string; // Optional property for the article body
}


const KnowBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedArticle(null);
  };

  const articles: Article[] = [
    { title: 'Welcome!', category: 'Sample Category', views: 101010, lastUpdated: '1 Year ago', 
      body: 'Welcome to Cache Flow, the smart and reliable ticketing system designed to keep your support process running smoothly. Whether you\'re resolving internal IT issues, handling customer queries, or managing service requests, Cache Flow gives you the tools to stay organized, responsive, and efficient.\n\nThis is the Knowledge Base! Here, you will find a comprehensive collection of articles, guides, and resources designed to help you navigate and make the most of our system. Whether you are looking for troubleshooting tips, detailed explanations, or best practices, we have got you covered. Dive in and explore the wealth of information at your fingertips!' },
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
        <div className="knowledge-base-container" style={{ width: '220%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          </div>

          <div className="table-container" >
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
      </Main>
    </div>
  );
};

export default KnowBase;
