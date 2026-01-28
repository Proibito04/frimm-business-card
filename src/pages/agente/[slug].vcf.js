import { getAgenti } from "../../lib/googleSheets";

export async function getStaticPaths() {
  const agenti = await getAgenti();
  return agenti.map((agente) => ({
    params: { slug: agente.slug },
    props: { agente },
  }));
}

export async function GET({ props }) {
  const { agente } = props;
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${agente.nome} ${agente.cognome}
N:${agente.cognome};${agente.nome};;;
TITLE:${agente.ruolo}
TEL;TYPE=CELL:${agente.telefono || ""}
EMAIL;TYPE=INTERNET:${agente.email || ""}
ORG:FRIMM Academy
URL:https://www.frimmacademyitalia.com/
ADR;TYPE=WORK:;;Piazza Statuto, 16;Torino;;;Italy
${agente.foto_url ? `PHOTO;VALUE=URI:${agente.foto_url}` : ""}
END:VCARD`;

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${agente.nome}_${agente.cognome}.vcf"`,
    },
  });
}
