export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;
        console.log("Received message:", message);
        return

        try {
            // Replace with your actual Gemini API endpoint
            const response = await fetch('https://your-gemini-api.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            res.status(200).json({ reply: data.reply });
        } catch (error) {
            console.error("Error fetching response:", error);
            res.status(500).json({ reply: "Error: Unable to contact Gemini." });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
