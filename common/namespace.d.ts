declare namespace Express {
  interface Request {
    files: {[fieldname: string]: Multer.File[]} | Express.Multer.File[];
  }
}
