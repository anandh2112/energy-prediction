const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

function formatCategory(category) {
    return category
      .toLowerCase()
      .split(/[\s-]+/) 
      .map((word, index) => {
        if (index === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');
  }
  

const baseFolderPath = '/home/ubuntu/files';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let category = req.query.category;

    if (!category) {
      return cb(new Error('No category provided'), null);
    }

    category = formatCategory(category); 
    const folderPath = path.join(baseFolderPath, category);

    fs.access(folderPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`Folder does not exist: ${folderPath}`);
        return cb(new Error(`Folder does not exist: ${folderPath}`), null);
      }
      console.log(`Saving file to existing folder: ${folderPath}`);
      cb(null, folderPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
  
const upload = multer({ storage });

router.post('/uploadF', upload.single('file'), (req, res) => {
    const category = req.query.category;
  
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
  
    if (!category) {
      return res.status(400).send('No category provided');
    }
  
    const fileUrl = `/uploads/${formatCategory(category)}/${req.file.filename}`;
    res.status(200).send({ message: 'File uploaded successfully', fileUrl });
  });


  router.get('/listF', (req, res) => {
    let category = req.query.category;
    if (!category) {
      return res.status(400).send('No category provided');
    }
  
    category = formatCategory(category);
  
    const folderPath = path.join(baseFolderPath, category);
  
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return res.status(500).send('Failed to read files');
      }
  
      const fileList = files.map((file) => ({
        name: file,
        date: fs.statSync(path.join(folderPath, file)).mtime.toLocaleDateString(),
        url: `/uploads/${category}/${file}`,
      }));
  
      res.status(200).send(fileList);
    });
  });
  
  router.get('/download', (req, res) => {
    let category = req.query.category;
    const filename = req.query.filename;
  
    if (!category || !filename) {
      return res.status(400).send('Category and filename required');
    }
  
    category = formatCategory(category);
    const filePath = path.join(baseFolderPath, category, filename);
  
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return res.status(404).send('File not found');
      }
    });
  });

router.delete('/delete', (req, res) => {
  let { category, filename } = req.query;

  if (!category || !filename) {
    return res.status(400).send('Category and filename required');
  }

  category = formatCategory(category);
  const filePath = path.join(baseFolderPath, category, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', err);
      return res.status(404).send('File not found');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).send('Failed to delete file');
      }

      console.log(`File ${filename} successfully deleted.`);
      res.status(200).send({ message: 'File deleted successfully' });
    });
  });
});
  
  

module.exports = router;