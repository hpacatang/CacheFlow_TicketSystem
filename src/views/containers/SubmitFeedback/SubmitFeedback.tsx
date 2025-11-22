import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import UserSidebar from '../../components/Sidebars/UserSidebar'
import FeedbackRatingModal from '../../components/Modals/FeedbackRatingModal'
import EditIcon from '@mui/icons-material/Edit'

interface Ticket {
  id: string
  summary: string
  userID: number      
  agentID: number     
  status: string
  resolvedAt: string | null
  dueDate: string
  priority: string
  category: string
  feedbackCount: number
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  padding: 0,
  height: '35rem',
  width: '70rem',
  marginLeft: '2rem',
  overflowY: 'auto',
  backgroundColor: 'rgba(22, 123, 187, 0.1)',
}))

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  borderBottom: '3px solid #000',
  padding: '20px',
  backgroundColor: '#e8f3f9',
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  border: 'none',
  backgroundColor: '#e8f3f9',
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0074d9',
  color: 'white',
  border: 'none',
  boxShadow: 'none',
  '&:hover': {
    border: 'none',
    boxShadow: 'none',
  },
  padding: theme.spacing(0.5, 1),
  textTransform: 'none',
}))

export const SubmitFeedback: React.FC = () => {
  const API_BASE_URL = '/api'

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('Feedback submitted!')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/ticket`)
        if (!response.ok) throw new Error('Failed to fetch tickets!')
        const data = await response.json()
        setTickets(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch tickets!')
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const handleSubmitFeedback = async (rating: number, feedback: string) => {
    try {
      if (!selectedTicketId) {
        throw new Error('No ticket selected')
      }

      const feedbackData = {
        ticketId: parseInt(selectedTicketId),
        rating: rating,
        comment: feedback,
        feedbackDate: new Date().toISOString(),
        status: 'Submitted'
      }

      // Send feedback to backend
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setSnackbarMessage('Feedback submitted successfully!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      setModalOpen(false)
      setSelectedTicketId(null)

    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Failed to submit feedback')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  if (error) {
    return (
      <Box display="flex">
        <UserSidebar />
        <Box p={3} flexGrow={1}>
          <Typography marginTop="2rem" marginLeft="2rem" variant="h4" gutterBottom fontWeight="bold">
            Submit Customer Feedback
          </Typography>
          <Box display="flex" justifyContent="center" my={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex">
      <UserSidebar />
      <Box p={3} flexGrow={1}>
        <Typography marginTop="3rem" marginLeft="2rem" variant="h4" gutterBottom fontWeight="bold">
          Submit Feedback
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer as={Paper}>
            <Table stickyHeader aria-label="submit feedback table">
              <TableHead>
                <TableRow>
                  <StyledTableHeaderCell>ID</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Summary</StyledTableHeaderCell>
                  <StyledTableHeaderCell>User ID</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Agent ID</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Due Date</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Resolved at</StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center">Actions</StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.id} hover>
                    <StyledTableCell>{ticket.id}</StyledTableCell>
                    <StyledTableCell>{ticket.summary}</StyledTableCell>
                    <StyledTableCell>{ticket.userID}</StyledTableCell>
                    <StyledTableCell>{ticket.agentID}</StyledTableCell>
                    <StyledTableCell>{ticket.status}</StyledTableCell>
                    <StyledTableCell>{ticket.dueDate}</StyledTableCell>
                    <StyledTableCell>{ticket.resolvedAt || ''}</StyledTableCell>
                    <StyledTableCell align="center">
                      <SubmitButton
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setSelectedTicketId(ticket.id)
                          setModalOpen(true)
                        }}
                      >
                        Submit Feedback
                      </SubmitButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </Box>
      <FeedbackRatingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ticketId={selectedTicketId || ''}
        onSubmit={handleSubmitFeedback}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SubmitFeedback