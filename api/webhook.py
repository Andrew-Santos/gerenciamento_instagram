from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.requests import Request
from starlette.routing import Route

VERIFY_TOKEN = "AWMSSANTOS"  # Troque aqui pelo seu token

async def verify(request: Request):
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        return PlainTextResponse(challenge, status_code=200)
    return PlainTextResponse("Erro de verificação", status_code=403)

async def webhook_event(request: Request):
    data = await request.json()
    print("Evento recebido:", data)
    return PlainTextResponse("OK", status_code=200)

routes = [
    Route("/api/webhook", verify, methods=["GET"]),
    Route("/api/webhook", webhook_event, methods=["POST"])
]

app = Starlette(routes=routes)
