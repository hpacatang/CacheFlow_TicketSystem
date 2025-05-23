import type React from "react"
import { Dialog, DialogContent, IconButton, Typography, Box, Paper, styled } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"


interface FeedbackDetails {
  id: string
  rating: number
  feedback: string
}

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  feedback: FeedbackDetails | null
}

const RatingBox = styled(Paper)(({ theme }) => ({
  backgroundColor: "#2196f3",
  color: "black",
  width: "48px",
  height: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  fontSize: "24px",
  fontWeight: "bold",
}))

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  position: "relative",
  minWidth: "600px",
  maxWidth: "800px",
  [theme.breakpoints.down("sm")]: {
    minWidth: "unset",
    width: "100%",
  },
}))

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.grey[800],
}))

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose, feedback }) => {
  if (!feedback) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        // Dialog box styling, because it is confusing not to know! xD
        sx: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          height: "1000px",
        },
      }}
    >
      <StyledDialogContent>
        <CloseButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </CloseButton>

        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Feedback from the Customer
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 3, mb: 4 }}>
          <Typography variant="h6" component="span" sx={{ mr: 2 }}>
            Ticket Rating:
          </Typography>
          <RatingBox>{feedback.rating}</RatingBox>
        </Box>

        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            Feedback:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {feedback.feedback}
          </Typography>
        </Box>
      </StyledDialogContent>
    </Dialog>
  )
}

export default FeedbackModal