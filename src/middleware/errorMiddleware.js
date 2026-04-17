const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'Duplicate entry. This record already exists.' });
  }
  
  // MySQL foreign key error
  if (err.code === 'ER_ROW_IS_REFERENCED' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'Invalid reference. Related record not found.' });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
};

const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };