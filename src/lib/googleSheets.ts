const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRj4KkOgVdtfaf5dsjUpaj7mPNVHR-afINMfN5ltYOn5d4awJWHNbFufmSa6DsEEedJuBbKLnEqWSBL/pub?output=csv';

export interface Agente {
    slug: string;
    nome: string;
    cognome: string;
    ruolo: string;
    foto_url: string;
    telefono: string;
    email: string;
    linkedin: string;
    prefisso: string;
    whatsapp: string;
}

export async function getAgenti(): Promise<Agente[]> {
    try {
        const response = await fetch(SHEET_URL, { redirect: 'follow' });
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        return [];
    }
}

function parseCSV(csvText: string): Agente[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1);

    return data.map(line => {
        // Handle potential commas inside quotes if necessary, but for this specific sheet it looks simple
        // A more robust parser would be needed for complex CSVs, but let's start simple
        const values = line.split(',').map(v => v.trim());
        const agente: any = {};
        headers.forEach((header, index) => {
            agente[header] = values[index] || '';
        });
        return agente as Agente;
    });
}
