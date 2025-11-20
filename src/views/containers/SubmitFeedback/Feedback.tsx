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
import Layout from '../../Layout'
import FeedbackRatingModal from '../../components/Modals/FeedbackRatingModal'

interface Ticket {
  id: string
  summary: string
  name: string
  assignee: string
  status: string
  resolvedAt: string | null
  dueDate: string
  priority: string
  category: string
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
  backgroundColor: 'rgba(22, 123, 187, 0.1)',
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  border: 'none',
  backgroundColor: 'rgba(22, 123, 187, 0.1)',
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: 'black',
  border: 'none',
  boxShadow: 'none',
  '&:hover': {
    color: '#1B65AD',
    border: 'none',
    boxShadow: 'none',
  },
  padding: theme.spacing(0.5, 1),
  textTransform: 'none',
}))

export const SubmitFeedback: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3001/tickets')
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

  const handleSubmitFeedback = (rating: number, feedback: string) => {
    // Here you would send feedback to the backend
    setSnackbarOpen(true)
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Layout module="submitFeedback">
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
                  <StyledTableHeaderCell>Reporter</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Assignee</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Due Date</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Resolved at</StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center"></StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.id} hover>
                    <StyledTableCell>{ticket.id}</StyledTableCell>
                    <StyledTableCell>{ticket.summary}</StyledTableCell>
                    <StyledTableCell>{ticket.name}</StyledTableCell>
                    <StyledTableCell>{ticket.assignee}</StyledTableCell>
                    <StyledTableCell>{ticket.status}</StyledTableCell>
                    <StyledTableCell>{ticket.dueDate}</StyledTableCell>
                    <StyledTableCell>{ticket.resolvedAt || ''}</StyledTableCell>
                    <StyledTableCell align="center">
                      <SubmitButton
                        variant="contained"
                        size="small"
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
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Feedback submitted!
        </Alert>
      </Snackbar>
    </Layout>
  )
}

export default SubmitFeedback


