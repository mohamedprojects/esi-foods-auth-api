import { Router } from "express";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  deleteUser,
} from "../../utils/firebase.js";

const router = Router();
const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const { email, password } = req.body;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      // Signed in
      res.send({
        email: userCredentials.user.email,
        uid: userCredentials.user.uid,
        emailVerified: userCredentials.user.emailVerified,
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      // Signed in
      res.send({
        email: userCredentials.user.email,
        uid: userCredentials.user.uid,
        emailVerified: userCredentials.user.emailVerified,
        photoURL: userCredentials.user.photoURL,
        displayName: userCredentials.user.displayName,
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.post("/logout", (req, res) => {
  signOut(auth)
    .then(() => {
      res.send({
        message: "Logged out",
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.post("/verification", (req, res) => {
  sendEmailVerification(auth.currentUser)
    .then(() => {
      res.send({
        message: "Verification email sent",
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.post("/photourl", (req, res) => {
  const { photoUrl } = req.body;
  updateProfile(auth.currentUser, {
    photoURL: photoUrl,
  })
    .then(() => {
      res.send({
        message: "Photo url updated",
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.get("/infos", (req, res) => {
  if (auth.currentUser) {
    res.send({
      email: auth.currentUser.email,
      uid: auth.currentUser.uid,
      emailVerified: auth.currentUser.emailVerified,
      photoURL: auth.currentUser.photoURL,
      displayName: auth.currentUser.displayName,
    });
  } else {
    res.status(500).send({
      error: "User not logged in",
    });
  }
});

authRouter.post("/update", (req, res) => {
  const { displayName } = req.body;
  updateProfile(auth.currentUser, {
    displayName: displayName,
  })
    .then(() => {
      res.send({
        message: "Profile updated",
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

authRouter.post("/delete", (req, res) => {
  deleteUser(auth.currentUser)
    .then(() => {
      res.send({
        message: "User deleted",
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: error.message,
        eroorCode: error.code,
      });
    });
});

// Welcome
router.get("/", (req, res) => {
  res.send("Welcome to the ESI Foods AUTH With Firebase Auth");
});

router.use("/auth", authRouter);

export default router;
