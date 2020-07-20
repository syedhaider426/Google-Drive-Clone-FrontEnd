import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
} from "@material-ui/core";
import postData from "../helpers/postData";
import Snack from "./Snack";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

class RenameFolder extends Component {
  state = {
    renamedSnack: false,
    foldername: "",
    renamedFolder: {},
  };

  handleRenameSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      renamedSnack: false,
    });
  };

  handleRenameFolderClose = () => {
    this.setState(
      { foldername: "" },
      this.props.handleDialog({ renameFolderDialogOpen: false })
    );
  };

  handleFolderOnChange = (e) => {
    if (e.target.value === "") this.setState({ foldername: "" });
    else
      this.setState({
        foldername: e.target.value,
      });
  };

  handleRenameFolder = (e) => {
    e.preventDefault();
    const { selectedFolders } = { ...this.props };
    const { foldername } = { ...this.state };
    const data = {
      id: selectedFolders[0].id,
      newName: foldername,
    };

    postData("/api/folders/rename", data)
      .then((data) => {
        const { selectedFolders } = { ...this.props };
        let folders = this.props.folders;
        folders.find((o, i, arr) => {
          if (o._id === selectedFolders[0].id) {
            arr[i].foldername = foldername;
            return true;
          }
          return false;
        });
        const selectFolders = selectedFolders;
        selectFolders[0].foldername = foldername;
        this.setState(
          {
            renamedFolder: selectedFolders[0],
            renamedSnack: true,
          },
          this.props.handleDialog(
            { renameFolderDialogOpen: false },
            { folders, selectedFolders: selectFolders }
          )
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoRenameFolder = () => {
    const { renamedFolder } = { ...this.state };
    const { selectedFolders } = { ...this.props };
    const data = {
      id: renamedFolder.id,
      newName: renamedFolder.foldername,
    };
    console.log(data);
    postData("/api/folders/rename", data)
      .then((data) => {
        let folders = this.props.folders;
        folders.find((o, i, arr) => {
          if (o._id === selectedFolders[0].id) {
            arr[i].foldername = selectedFolders[0].foldername;
            return true;
          }
          return false;
        });
        this.setState(
          {
            renamedFolder: {},
            renamedSnack: false,
            folderName: "",
          },
          this.props.handleDialog(
            { renameFolderDialogOpen: false },
            {
              folders,
              selectedFolders: (selectedFolders[0].foldername =
                renamedFolder.foldername),
            }
          )
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.state.renamedFolder) {
      this.setState({
        renamedFolder: {},
      });
    }
    return;
  };
  render() {
    const { renamedSnack, foldername } = {
      ...this.state,
    };
    const { selectedFolders, classes } = { ...this.props };
    const renameSnack = (
      <Snack
        open={renamedSnack}
        onClose={this.handleRenameSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Renamed "${this.state.renamedFolder.foldername}" to "${this.state.foldername}"`}
        onClick={this.handleUndoRenameFolder}
      />
    );
    const renameFolderDialog = (
      <Dialog
        open={this.props.renameFolderDialogOpen}
        onClose={this.handleRenameFolderClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Rename
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={this.handleRenameFolderClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={this.handleRenameFolder} method="POST">
          <DialogContent>
            <TextField
              autoFocus
              id="folder"
              defaultValue={selectedFolders[0] && selectedFolders[0].foldername}
              onChange={this.handleFolderOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRenameFolderClose} color="primary">
              Cancel
            </Button>
            <Button disabled={foldername === ""} color="primary" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    return (
      <Fragment>
        {renameSnack}
        {renameFolderDialog}
      </Fragment>
    );
  }
}

export default withStyles(styles)(RenameFolder);
