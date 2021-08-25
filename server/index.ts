import express, {Request, Response} from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer();
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post(
  '/parse',
  upload.fields([
    {name: 'rom', maxCount: 1},
    {name: 'bios', maxCount: 1},
  ]),
  (req: Request, res: Response) => {
    if ('rom' in req?.files && 'bios' in req?.files) {
      res.status(201).json({
        rom: new Uint8Array([...req.files['rom'][0].buffer]),
        bios: new Uint8Array([...req.files['bios'][0].buffer]),
      });
    } else {
      res.sendStatus(400);
    }
  }
);

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
