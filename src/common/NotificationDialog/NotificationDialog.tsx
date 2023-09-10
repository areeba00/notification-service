// import { ChangeEvent } from "react";
// import "./NotificationDialog.css";

// interface EditDialogProps {
//   open: boolean;
//   onClose: () => void;
//   formData: {
//     name: string;
//     description: string;
//     template_subject: string;
//     template_body: string;
//   };
//   handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
//   handleSave: () => void;
// }

// const NotificationDialog: React.FC<EditDialogProps> = ({
//   open,
//   onClose,
//   formData,
//   handleInputChange,
//   handleSave,
// }) => {
//   if (!open) {
//     return null; // Return null when the dialog is closed
//   }
//   const handleClick = () => {
//     // Validate username and password
//     validateUsername(username);
//     validateSubject(subject);
//     validateBody(Body);
//   };
//   //function for username validation
//   const validateUsername = (value: string) => {
//     if (value.length === 0) {
//       setUsernameError("Username is required");
//       return false;
//     } else {
//       setUsernameError("");
//       return true;
//     }
//   };
//   //function for password validation
//   const validateSubject = (value: string) => {
//     if (value.length === 0) {
//       setSubjectError("Enter subject");
//       return false;
//     } else {
//       setSubjectError("");
//       return true;
//     }
//   };
//   const validateBody = (value: string) => {
//     if (value.length === 0) {
//       setBodyError("Body is required");
//       return false;
//     } else {
//       setBodyError("");
//       return true;
//     }
//   };
//   const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const value = e.target.value;
//     setBody(value); // Update the Body state
//     setBodyError(""); // Clear any previous errors
//     setBodyPreview(value); // Update the preview
//   };

//   return (
//     <body className="li-body">
//       <div className="containner">
//         <div id="loginform" className="input-containner">
//           <br />
//           <h1 id="login-headerTitle">Notification </h1>
//           <div className="row">
//             <label>Name</label>
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="row">
//             <label>Description</label>
//             <input
//               type="text"
//               placeholder="Enter subject"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="row">
//             <label>Template Subject</label>
//             <input
//               type="text"
//               placeholder="Enter subject"
//               value={formData.template_subject}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="row">
//             <label>Template Body</label>
//             <div className="row-with-preview">
//               <input
//                 className="bodyyy"
//                 // rows={5}
//                 placeholder="Enter Text"
//                 value={formData.template_body}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>
//           <div id="button" className="row">
//             <button onClick={handleSave}>Submit</button>
//             <button className="Cancel-button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </div>
//         {/* <div>
//           <textarea className="body-preview" rows={22.9} value={Body} />
//         </div> */}
//       </div>
//     </body>
//   );
// };

// export default NotificationDialog;

// EditDialog.tsx

import React, { ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    template_subject: string;
    template_body: string;
  };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const NotificationDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "90%",
          maxWidth: "600px",
          height: "80vh",
          maxHeight: "600px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "20px" }}>
        Edit Application
      </DialogTitle>
      <DialogContent style={{ padding: "26px" }}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          variant="outlined"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          label="Template Subject"
          name="template_subject"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.template_subject}
          onChange={handleInputChange}
        />
        <TextField
          label="Template Body"
          name="template_body"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.template_body}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
