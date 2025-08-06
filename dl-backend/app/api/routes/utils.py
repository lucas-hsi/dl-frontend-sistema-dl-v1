# dl-backend/app/api/routes/utils.py

from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

# Mantemos as importações necessárias
from app.api.deps import get_current_active_superuser
from app.models import Message
from app.utils import generate_test_email, send_email
from app.schemas.common import ApiResponse

# O prefixo e a tag já estão definidos aqui, o que é ótimo.
router = APIRouter(prefix="/utils", tags=["utils"])


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    # TODO: Reverter para implementação real
    # email_data = generate_test_email(email_to=email_to)
    # send_email(
    #     email_to=email_to,
    #     subject=email_data.subject,
    #     html_content=email_data.html_content,
    # )
    # return Message(message="Test email sent")
    return Message(message="Test email sent")


# --- NOSSO HEALTH-CHECK OFICIAL E PADRONIZADO ---
@router.get(
    "/health-check", # Renomeado para ser o caminho principal
    response_model=ApiResponse[str],
    summary="Verifica a saúde da API com padrão ApiResponse",
)
async def health_check():
    """
    Endpoint padrão para verificar a disponibilidade da aplicação.
    """
    return ApiResponse[str](ok=True, data="API is running smoothly!")

# As rotas antigas "/health-check/" e "/healthz" foram removidas.