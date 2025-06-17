/**
 * Minimal Express server.
 * TODO markers highlight the areas the candidate must implement.
 */

import express from 'express';
import { dealService } from './services/dealsService';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.get('/ping', (_req, res) => res.json({ message: 'pong' }));

app.get('/deals/summary', (_req, res) => {
  try {
    const summaryResponse = dealService.getSummary();

    if (!summaryResponse) {
      return res.status(404).json({ message: 'No summary data found.' });
    }

    res.status(200).json({
      summary: summaryResponse
    })

  } catch (error) {
    console.error('Error fetching summary:', error);

    res.status(500).json({ message: 'Unable to fetch summary due to server error.' });
  }
  
});

/* ── Endpoint: /deals/:id ──────────────────────────────────── */
app.get('/deals/:id', (req, res) => {
  try {

    const deal = dealService.getDealsById(req.params.id);
    if (!deal) {
      res.status(404).json({
        message: "Unable to find deal with this id"
      })
    }

    res.status(200).json({
      data: deal
    })
    
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: "Unable to fetch summary!" })
  }

});

/* ── Global error handler (optional bonus) ─────────────────── */

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
