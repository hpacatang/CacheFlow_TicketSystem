import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, IconButton, Typography, Box, TextField, Button, styled } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

interface FeedbackRatingModalProps {
  open: boolean
  onClose: () => void
  ticketId: string
  onSubmit: (rating: number, feedback: string) => void
}

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  position: "relative",
  minWidth: "500px",
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

const RatingButton = styled(Button)<{ selected?: boolean; ratingValue: number }>(({ theme, selected, ratingValue }) => {
  const getBackgroundColor = () => {
    if (!selected) return "#e3f2fd"

    switch (ratingValue) {
      case 1:
        return "#bbdefb"
      case 2:
        return "#90caf9"
      case 3:
        return "#64b5f6"
      case 4:
        return "#42a5f5"
      case 5:
        return "#2196f3"
      default:
        return "#e3f2fd"
    }
  }

  return {
    width: "48px",
    height: "48px",
    minWidth: "unset",
    margin: theme.spacing(0, 0.5),
    backgroundColor: getBackgroundColor(),
    color: selected ? "white" : theme.palette.text.primary,
    fontWeight: "bold",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: selected ? getBackgroundColor() : "#bbdefb",
    },
    [theme.breakpoints.down("sm")]: {
      width: "40px",
      height: "40px",
      fontSize: "16px",
    },
  }
})

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#2196f3",
  color: "white",
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#1976d2",
  },
}))

const FeedbackRatingModal: React.FC<FeedbackRatingModalProps> = ({ open, onClose, ticketId, onSubmit }) => {
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleSubmit = () => {
    if (rating !== null) {
      onSubmit(rating, feedback)
      setRating(null)
      setFeedback("")
      onClose()
    }
  }

  const handleClose = () => {
    setRating(null)
    setFeedback("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <CloseButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </CloseButton>

        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Feedback
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h6" component="p" gutterBottom>
            How would you rate this ticket?
          </Typography>
          <Box sx={{ display: "flex", mt: 1 }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingButton
                key={value}
                onClick={() => handleRatingClick(value)}
                selected={rating === value}
                ratingValue={value}
                variant={rating === value ? "contained" : "outlined"}
              >
                {value}
              </RatingButton>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="p" gutterBottom>
            Write your experience:
          </Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            variant="outlined"
            placeholder="Please share your thoughts about our service..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SubmitButton onClick={handleSubmit} disabled={rating === null}>
            Submit Feedback
          </SubmitButton>
        </Box>
      </StyledDialogContent>
    </Dialog>
  )
}

export default FeedbackRatingModal;