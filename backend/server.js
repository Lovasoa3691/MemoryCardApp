const express = require('express');
const cors = require('cors');
const pdfParse = require('pdf-parse');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/upload', async (req, res) => {
  try {
    const { file: base64File, name } = req.body;

    if (!base64File || !name) {
      return res.status(400).json({ error: 'Fichier manquant' });
    }

    const pdfBuffer = Buffer.from(base64File, 'base64');

    const data = await pdfParse(pdfBuffer);

    const sentences = data.text.split(/\n+/).filter(line => line.trim() !== '');
  
    const cards = sentences.map((sentence, index) => ({
      title: `Carte ${index + 1}`,
      content: sentence,
    }));

    
    res.json({ cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du traitement du fichier.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${port}`);
});

