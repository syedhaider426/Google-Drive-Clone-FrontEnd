import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import postData from "../../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Header from "../header-components/Header";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// User will register their account and be sent an email to confirm their identity
export default function Register() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  let history = useHistory();

  // User types in email and updates the email hook
  const handleEmailChange = ({ target }) => {
    if (target.value === "") errors.email = "Email is required";
    else delete errors.email;
    setEmail(target.value);
    setErrors(errors);
  };

  // When the email textbox loses focus, function checks to see if the email entered is valid
  const handleEmailBlur = ({ target }) => {
    if (!validateEmail(target.value) && !errors.email)
      errors.email = "Please enter a valid email";
    else delete errors.email;
    setErrors(errors);
  };

  // Validate the syntax of the email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  // User types in password and updates the password hook
  const handlePasswordChange = ({ target }) => {
    if (target.value === "") errors.password = "Password is required";
    else if (target.value !== confirmPassword && confirmPassword !== "")
      errors.password = "Passwords do not match";
    else delete errors.password;
    setPassword(target.value);
    setErrors(errors);
  };

  // User types in password that should be the same previously typed password and updates the password hook
  const handleConfirmPasswordChange = ({ target }) => {
    if (target.value === "") errors.confirmPassword = "Please confirm password";
    if (target.value !== password)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    setConfirmPassword(target.value);
    setErrors(errors);
  };

  // Closes the error snackbar
  const handleClose = () => {
    setRegisterError("");
  };

  /**
   * User submits user/password/confirmPassword to server
   * If the user does not exist, create user
   * Else, show error.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabledButton(true);
    let err = {};
    if (email === "") err.email = "Email is required.";
    if (password === "") err.password = "Password is required.";
    if (confirmPassword === "") err.confirmPassword = "Please confirm password";
    if (Object.keys(err).length !== 0) {
      setErrors(err);
      setDisabledButton(false);
    } else {
      const data = { email, password, confirmPassword };
      document.body.style.cursor = "wait";
      postData("/api/users/registration", data)
        .then((data) => {
          const { success } = data;
          if (success) {
            document.body.style.cursor = "default";
            history.push("/verification");
            return;
          } else {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            let register =
              "User already exists. Please login or try to register again.";
            setRegisterError(register);
            document.body.style.cursor = "default";
          }
        })
        .catch((err) => console.log("Error", err));
    }
  };

  const failRegister = (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={registerError}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        {registerError}
      </Alert>
    </Snackbar>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header></Header>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {failRegister}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={errors.email?.length > 0}
            helperText={errors.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errors.password?.length > 0}
            helperText={errors.password}
            onChange={handlePasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirm Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errors.confirmPassword?.length > 0}
            helperText={errors.confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={disabledButton}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}
