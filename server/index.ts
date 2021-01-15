import { LoDashStatic } from 'lodash';
import { Response, Request } from 'express';
import * as express from 'express';
import { Byte, ByteArray } from '../client/src/components/Types';
const path = require('path');
const multer = require('multer');

const upload = multer();
const app = express();
const _: LoDashStatic = require('lodash');

interface MulterRequest extends Request {
  files: any;
}

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post(
  '/parse',
  upload.fields([
    { name: 'rom', maxCount: 1 },
    { name: 'bios', maxCount: 1 },
  ]),
  (req: MulterRequest, res: Response) => {
    if ('rom' in req.files && 'bios' in req.files) {
      res.status(201).json({
        rom: new ByteArray([...req.files['rom'][0].buffer]),
        bios: new ByteArray([...req.files['bios'][0].buffer]),
      });
    } else {
      res.sendStatus(400);
    }
  }
);

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000');
});
