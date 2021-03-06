import React, { useState, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import patchData from "../../helpers/patchData";
import Snack from "../reusable-components/Snack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

// Rename a file
export default function RenameFile({
  handleFocus,
  renameFileDialogOpen,
  files,
  folders,
  selectedFiles,
  setRenameFileDialogOpen,
  setItems,
}) {
  const [renamedSnack, setRenamedSnack] = useState(false);
  const [renamedFile, setRenamedFile] = useState("");
  const [fileName, setFileName] = useState("");

  // After a file is renamed, a snackbar will show. This function closes it.
  const handleRenameSnackClose = (event, reason) => {
    if (reason !== "clickaway") setRenamedSnack(false);
  };

  // Closes the 'Rename File' dialog
  const handleRenameFileClose = () => {
    setFileName("");
    setRenameFileDialogOpen(false);
  };

  // Sets the new name of the file
  const handleFileOnChange = (e) => {
    setFileName(e.target.value);
  };

  // When user submits form, rename the file
  const handleRenameFile = (e) => {
    e.preventDefault();
    const oldName = selectedFiles[0].filename;
    const data = {
      id: selectedFiles[0]._id,
      newName: fileName,
    };
    patchData("/api/files/name", data)
      .then((data) => {
        // Updates file name in files
        files.find((o, i, arr) => {
          if (o._id === selectedFiles[0]._id) {
            arr[i].filename = fileName;
            return true;
          }
          return false;
        });
        setRenamedFile(oldName); // set temp name
        setRenamedSnack(true); // show snack
        setRenameFileDialogOpen(false); // close 'rename file' dialog
        setItems({ folders, files });
      })
      .catch((err) => console.log("Err", err));
  };

  // If user chooses to revert back to original name, this function will revert it back
  const handleUndoRenameFile = () => {
    const data = {
      id: selectedFiles[0]._id,
      newName: renamedFile,
    };
    patchData("/api/files/name", data)
      .then((data) => {
        // Updates file name in files
        files.find((o, i, arr) => {
          if (o._id === selectedFiles[0]._id) {
            arr[i].filename = selectedFiles[0].filename;
            return true;
          }
          return false;
        });

        selectedFiles[0].filename = renamedFile;
        setRenamedSnack(false); // close snack
        setRenamedFile(""); // empty temp name
        setFileName(""); // clear any reference to "new" file name
        setItems({ folders, files });
      })
      .catch((err) => console.log("Err", err));
  };

  // When the snackbar closes, remove old file name in temp
  const handleSnackbarExit = () => {
    if (renamedFile) setRenamedFile("");
  };

  const classes = useStyles();
  const renameSnack = (
    <Snack
      open={renamedSnack}
      onClose={handleRenameSnackClose}
      onExited={handleSnackbarExit}
      message={`Renamed "${renamedFile}" to "${fileName}"`}
      onClick={handleUndoRenameFile}
    />
  );
  const defaultValue = selectedFiles[0] && selectedFiles[0].filename;
  const renameFileDialog = (
    <Dialog
      open={renameFileDialogOpen}
      onClose={handleRenameFileClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Rename
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleRenameFileClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleRenameFile} method="POST">
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="file"
            fullWidth
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onChange={handleFileOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameFileClose} color="primary">
            Cancel
          </Button>
          <Button disabled={fileName === ""} color="primary" type="submit">
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <Fragment>
      {renameSnack}
      {renameFileDialog}
    </Fragment>
  );
}
