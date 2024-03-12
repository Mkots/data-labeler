import bodyParser from "body-parser";
import csvParser from "csv-parser";
import { stringify } from "csv-stringify";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";

const app: Express = express();
const router = express.Router()
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI || "mongodb://mongodb:27017/mydatabase";

const upload = multer({ dest: 'uploads/' });
const messageSchema = new mongoose.Schema({
  text: {
      type: String,
      required: true,
  },
  label: {
      type: Number,
      required: false, 
      default: null, 
  },
});

const Message = mongoose.model('Message', messageSchema);
mongoose.connect(dbURI);

app.use(bodyParser.json());


router.post('/upload', upload.single('data.csv'), (req, res) => {
  const results: Array<{text: string, label?: number, }> = [];
  console.log(req);
  
  fs.createReadStream(req.file!.path)
    .pipe(csvParser({
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim()
    }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
          Message.insertMany(results)
              .then(() => {
                  fs.unlinkSync(req.file!.path); 
                  res.send('File successfully uploaded and processed');
              })
              .catch((error) => {
                  console.error(error);
                  res.status(500).send('Error when saving data');
              });
      })
      .on('error', (error) => {
          console.error('Error while reading a file:', error);
          res.status(500).send('Error during file processing');
      });
});

router.get('/message/:id', async (req, res) => {
  const message = await Message.findById(req.params.id);
  res.json(message);
});

router.put('/message/:id', async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(message);
});

router.get('/download', async (req, res) => {
  const records = await Message.find();
  stringify(records, { header: true }, (err, output) => {
      if (err) throw err;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=\"download.csv\"');
      res.end(output);
  });
});

router.get("/ping", (req: Request, res: Response) => {
  res.send("PONG");
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});