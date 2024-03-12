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

type DataShape = { text: string, label?: number, }
type DataStape = { text: string, label: number, reviwed: boolean}

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
  reviewed: {
      type: Boolean,
      required: false,
      default: false,
  }
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
      mapValues: ({ value }) => value ? value.trim() : undefined,
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

router.get('/message', async (_, res) => {
  const message = await Message.findOne({ reviewed: false })
  res.json(message)
})

router.put('/message', async (req: Request< { old: DataShape, new: DataStape /*with label*/ }>, res) => {
  const message = await Message.findOneAndReplace(req.body.old, req.body.new)
  res.json(message)
})

router.get('/download', async (_, res) => {
  const records = await Message.find({ reviewed: true });
  const messages = records.map((record) => {
    return {
      text: record.text,
      label: record.label,
      reviewed: record.reviewed,
    }
  });
  stringify(messages, { header: true }, (err, output) => {
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