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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Snackbar,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AdminSidebar from "../../components/Sidebars/AdminSidebar"
import FeedbackModal from "../../components/Modals/FeedbackModal"
import './CustomerFB.css';

interface Ticket {
  id: string
  summary: string
  reporter: string
  assignee: string
  status: string
  createdAt: string
  resolvedAt: string
}

interface FeedbackDetails {
  id: string
  rating: number
  feedback: string
}


const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "20px",
  padding: 0,
  height: "55rem",
  width: "70rem",
  marginLeft: "2rem",
  overflowY: "auto",
  backgroundColor: "rgba(22, 123, 187, 0.1)",
}))

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold", 
  borderBottom: "3px solid #000",
  padding: "20px",
  backgroundColor: "rgba(22, 123, 187, 0.1)",
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  border: "none",
  backgroundColor: "rgba(22, 123, 187, 0.1)",
}))

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "black",
  border: "none",
  boxShadow: "none",
  "&:hover": {
    color: "#1B65AD",
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDetails | null>(null)

  const handleDrawerClose = () => {
    setSidebarOpen(false)
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a fetch with setTimeout
        setTimeout(() => {
          const demoTickets: Ticket[] = [
            {
              id: "01",
              summary: "Sample sample sample...",
              reporter: "Sample Name",
              assignee: "Sample Name",
              status: "Closed",
              createdAt: "01-01-2025",
              resolvedAt: "01-01-2025",
            },
            {
              id: "02",
              summary: "Login issue on mobile app",
              reporter: "John Doe",
              assignee: "Jane Smith",
              status: "Open",
              createdAt: "02-01-2025",
              resolvedAt: "",
            },
            {
              id: "03",
              summary: "Payment processing error",
              reporter: "Alice Johnson",
              assignee: "Bob Williams",
              status: "In Progress",
              createdAt: "03-01-2025",
              resolvedAt: "",
            },
          ]
          setTickets(demoTickets)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("Failed to fetch tickets")
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleViewFeedback = (id: string) => {
    // In a real app, this would fetch the feedback details from an API
    // For demo purposes, we'll create mock feedback data
    const mockFeedback = {
      id,
      rating: 5,
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    }

    setSelectedFeedback(mockFeedback)
    setModalOpen(true)
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box display="flex">
      <AdminSidebar />
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
                  <StyledTableHeaderCell>ID</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Summary</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Reporter</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Assignee</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Created at</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Resolved at</StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center">Actions</StyledTableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <StyledTableCell>{ticket.id}</StyledTableCell>
                    <StyledTableCell>{ticket.summary}</StyledTableCell>
                    <StyledTableCell>{ticket.reporter}</StyledTableCell>
                    <StyledTableCell>{ticket.assignee}</StyledTableCell>
                    <StyledTableCell>{ticket.status}</StyledTableCell>
                    <StyledTableCell>{ticket.createdAt}</StyledTableCell>
                    <StyledTableCell>{ticket.resolvedAt}</StyledTableCell>
                    <StyledTableCell align="center">
                      <ViewButton variant="contained" size="small" onClick={() => handleViewFeedback(ticket.id)}>
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
    </Box>
  )
}

export default CustomerFeedback