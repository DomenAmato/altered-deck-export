app.get('/api/deck', async (req, res) => {
    let input = req.query.url;

    if (!input) {
        return res.status(400).json({ error: 'Input mancante' });
    }

    try {
        // Logica per estrarre l'ID:
        // Se l'input contiene "/", prendiamo l'ultima parte, altrimenti usiamo l'input così com'è.
        const deckId = input.includes('/') ? input.split('/').filter(Boolean).pop() : input;
        
        const apiUrl = `https://api.altered.gg/decks/${deckId}`;

        const response = await axios.get(apiUrl, {
            headers: { 
                'Accept-Language': 'it-IT',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const data = response.data;
        const allCards = [];
        const types = ['character', 'spell', 'permanent'];

        if (data.deckCardsByType) {
            types.forEach(type => {
                const typeData = data.deckCardsByType[type];
                if (typeData && Array.isArray(typeData.deckUserListCard)) {
                    typeData.deckUserListCard.forEach(item => {
                        allCards.push({
                            quantity: item.quantity,
                            code: item.card.reference
                            // Nome e immagine rimossi come richiesto
                        });
                    });
                }
            });
        }

        res.json({
            name: data.name,
            cards: allCards
        });

    } catch (error) {
        res.status(500).json({ error: 'ID o URL non valido' });
    }
});