const VERIFY_TOKEN = "AWMSSANTOS";

export default function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Erro de verificação");
  }

  if (req.method === "POST") {
    console.log("Evento recebido:", req.body);
    return res.status(200).send("OK");
  }

  return res.status(405).send("Método não permitido");
}
