import React from "react";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";

const DeleteAllDialog = ({
  deleteAllOpen,
  handleDeleteAllClose,
  handleDeleteAll,
}) => {
  return (
    <Dialog
      open={deleteAllOpen}
      onClose={handleDeleteAllClose}
      aria-labelledby="restore-all-trash"
      aria-describedby="restore-all-trash"
    >
      <DialogTitle>Delete All</DialogTitle>
      <DialogContent>
        <form onSubmit={handleDeleteAll}>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all files and folders?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeleteAllClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllDialog;
