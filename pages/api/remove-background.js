import { createRouter } from "next-connect";
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { storage } from '../../app/firebase';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const upload = multer({ storage: multer.memoryStorage() });

const router = createRouter()

router.use(upload.single('image'));


router.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  // Prepare the FormData with the file buffer for Pixian API
  const formData = new FormData();
  formData.append('image', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  try {
    const apiResponse = await axios.post('https://api.pixian.ai/api/v2/remove-background', formData, {
      auth: {
        username: 'px3j2tc79h56pfg',
        password: 't01ahvv1cl98liqfa5ac57csf6seho8b47spe4v7kt57hmhr6527',
      },
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'arraybuffer',
    });

    if (apiResponse.status !== 200) {
      console.error('API call error:', apiResponse.status, apiResponse.data.toString());
      return res.status(apiResponse.status).json({ error: 'API error', details: apiResponse.data.toString('utf8') });
    }


    // Save the result to Firebase Storage
    const storageRef = ref(storage, `images/processed-${Date.now()}.png`);
  const snapshot = await uploadBytes(storageRef, apiResponse.data);
  const downloadURL = await getDownloadURL(snapshot.ref);

    res.status(200).json({ message: 'Background removed and image uploaded successfully', url: downloadURL });
  }catch (error) {
    console.error("Axios error:", error);
    return res.status(500).json({ error: 'Failed to make API call', details: error.message });
  }
});

export default router.handler();
export const config = {
  api: {
    bodyParser: false,  // Required to disable the default body parser since we're handling files
  },
};
