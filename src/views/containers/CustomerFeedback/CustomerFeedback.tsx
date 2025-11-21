import type React from "react"
import { useState, useEffect } from "react"
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
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Layout from "../../Layout"
import FeedbackModal from "../../components/Modals/FeedbackModal"
import VisibilityIcon from "@mui/icons-material/Visibility"

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

interface FeedbackDetails {
  id: string
  rating: number
  feedback: string
}

const API_BASE_URL = "/api"

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "20px",
  padding: 0,
  height: "35rem",
  width: "70rem",
  marginLeft: "2rem",
  overflowY: "auto",
  backgroundColor: "rgba(22, 123, 187, 0.1)",
}))

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  borderBottom: "3px solid #000",
  padding: "20px",
  backgroundColor: "#e8f3f9",
  wordBreak: "break-word",
  whiteSpace: "normal",
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  border: "none",
  backgroundColor: "#e8f3f9",
}))

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#0074d9",
  color: "white",
  border: "none",
  boxShadow: "none",
  "&:hover": {
    border: "none",
    boxShadow: "none",
  },
  padding: theme.spacing(0.5, 1),
  textTransform: "none",
}))

export const CustomerFeedback: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDetails | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/ticket`)
        if (!response.ok) throw new Error("Failed to fetch tickets!")
        const data = await response.json()
        setTickets(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch tickets!")
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleViewFeedback = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ticket/${id}/with-feedback`)
      if (!response.ok) throw new Error("Failed to fetch feedback!")
      const ticketWithFeedback = await response.json()
      
      const feedback = ticketWithFeedback.feedback[0] || {}
      setSelectedFeedback({
        id,
        rating: feedback.rating || 0,
        feedback: feedback.comment || "No feedback available"
      })
      setModalOpen(true)
    } catch (err) {
      setError("Failed to fetch feedback!")
    }
  }

  if (error) {
    return (
      <Layout module="customerFeedback">
        <Box p={3} flexGrow={1}>
          <Typography marginTop="3rem" marginLeft="2rem" variant="h4" gutterBottom fontWeight="bold">
            Customer Feedback
          </Typography>
          <Box display="flex" justifyContent="center" my={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout module="customerFeedback">
      <Box p={3} flexGrow={1}>
        <Typography marginTop="3rem" marginLeft="2rem" variant="h4" gutterBottom fontWeight="bold">
          Customer Feedback
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer as={Paper}>
            <Table stickyHeader aria-label="customer feedback table">
              <TableHead>
                <TableRow>
                  <StyledTableHeaderCell style={{ minWidth: 60 }}>ID</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 180 }}>Summary</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 120 }}>Reporter</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 120 }}>Assignee</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 100 }}>Status</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 120 }}>Due Date</StyledTableHeaderCell>
                  <StyledTableHeaderCell style={{ minWidth: 140 }}>Resolved at</StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center" style={{ minWidth: 120 }}>Actions</StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <StyledTableCell>{ticket.id}</StyledTableCell>
                    <StyledTableCell>{ticket.summary}</StyledTableCell>
                    <StyledTableCell>{ticket.name}</StyledTableCell>
                    <StyledTableCell>{ticket.assignee}</StyledTableCell>
                    <StyledTableCell>{ticket.status}</StyledTableCell>
                    <StyledTableCell>{ticket.dueDate}</StyledTableCell>
                    <StyledTableCell>{ticket.resolvedAt || ""}</StyledTableCell>
                    <StyledTableCell align="center">
                      <ViewButton variant="contained" size="small" onClick={() => handleViewFeedback(ticket.id)} startIcon={<VisibilityIcon />}>
                        View Feedback
                      </ViewButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </Box>
      <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} feedback={selectedFeedback} />
    </Layout>
  )
}

export default CustomerFeedback