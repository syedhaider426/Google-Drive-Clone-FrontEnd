import React, { Component } from "react";
import getData from "../helpers/getData";
import FileTable from "../components/FileTable";
import { withRouter } from "react-router-dom";

class Files extends Component {
  state = {
    files: [],
    folders: [],
    selectedFiles: [],
    selectedFolders: [],
    currentMenu: this.props.menu,
    loaded: false,
    snackbarOpen: false,
    filesModified: 0,
    foldersModified: 0,
    tempFiles: [],
    tempFolders: [],
    snackBarMessage: "",
    copySnackOpen: false,
    trashSnackOpen: false,
    favoritesSnackOpen: false,
    isFavorited: false,
    currentFolder: ["Home"],
    currentID: this.props.match.url,
    isLoaded: false,
  };

  fetchData = () => {
    getData(`/api${this.props.match.url}`)
      .then((data) => {
        this.setState({
          files: data.files,
          folders: data.folders,
          currentFolder: data.folderPath,
          currentMenu: this.props.menu,
          currentID: this.props.match.url,
          isLoaded: true,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.url != prevState.currentID) {
      this.fetchData();
    }
  }

  handleSetState = (value) => {
    this.setState(value);
  };

  render() {
    const {
      files,
      folders,
      selectedFiles,
      selectedFolders,
      currentMenu,
      loaded,
      snackbarOpen,
      filesModified,
      foldersModified,
      tempFiles,
      tempFolders,
      snackBarMessage,
      copySnackOpen,
      trashSnackOpen,
      favoritesSnackOpen,
      isFavorited,
      currentFolder,
      isLoaded,
    } = {
      ...this.state,
    };
    return (
      <FileTable
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        selectedFolders={selectedFolders}
        handleSetState={this.handleSetState}
        currentMenu={currentMenu}
        loaded={loaded}
        snackbarOpen={snackbarOpen}
        filesModified={filesModified}
        foldersModified={foldersModified}
        tempFiles={tempFiles}
        tempFolders={tempFolders}
        snackBarMessage={snackBarMessage}
        copySnackOpen={copySnackOpen}
        trashSnackOpen={trashSnackOpen}
        favoritesSnackOpen={favoritesSnackOpen}
        isFavorited={isFavorited}
        currentFolder={currentFolder}
        isLoaded={isLoaded}
      />
    );
  }
}

export default withRouter(Files);
