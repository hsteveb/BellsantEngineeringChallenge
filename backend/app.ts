import express, {Request, Response} from 'express';
import {getMachineHealth} from './machineHealth';
import * as firebase from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import cert = firebase.credential.cert;
import { auth } from 'firebase-admin';

declare global {
  namespace Express {
    import DecodedIdToken = auth.DecodedIdToken;

    interface Request {
      user: DecodedIdToken
    }
  }
}

const app = express();
const port = 3001;

const serviceAccountKey = require('./serviceAccountKey.json');

firebase.initializeApp({
  credential: cert(serviceAccountKey),
  databaseURL: 'bellsant-challenge-ff2a3.firebaseio.com'
})

// Middleware to parse JSON request bodies
app.use(express.json());

const db = getFirestore();

// Middleware used to check if user is logged-in
app.use(async (req: Request, res, next) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    let decodedToken = undefined;

    try {
      decodedToken = await firebase.auth().verifyIdToken(idToken);
      req.user = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  if (!req.user) {
      return res.status(401).json({error: 'Unauthorized'});
  }

  next();
})

// Get saved user machine health
app.get('/machine-health', async (req: Request, res: Response) => {
  const user = req.user
  try {
    let machineHealthDoc = await db.collection('machine-health').doc(user.uid).get();
    res.json(machineHealthDoc.data() || {});
  } catch {
    res.status(400).json({"message": "Cannot get machine health at this time."});
  }
});

// Update machine health with the new scores.
app.put('/machine-health', async (req: Request, res: Response) => {
  const user = req.user
  try {
    await db.collection('machine-health').doc(user.uid).set({ machines: req.body?.machines });
    res.send({ ok: 'success' });
  } catch {
    res.status(400).json({"message": "Cannot save at this time."});
  }
});

// Reset current machine health data for user.
app.post('/reset-machine-health', async (req: Request, res: Response) => {
  const user = req.user
  try {
    await db.collection('machine-health').doc(user.uid).set({});
    res.send({ ok: 'success' });
  } catch {
    res.status(400).json({"message": "Cannot clear at this time."});
  }
});

// Endpoint to get machine health score
app.post('/machine-health', async (req: Request, res: Response) => {
  const user = req.user
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    try {
      const data = {scores: result, machines: req?.body?.machines};
      await db.collection('machine-health').doc(user.uid).set(data);
      await db.collection('machine-health-history').doc().set({...data, userId: user.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp()})
      res.send({ ok: 'success' });
    } catch {
      res.status(400).json({"message": "Cannot calculate machine health at this time."});
    }
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
