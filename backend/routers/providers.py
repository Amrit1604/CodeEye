import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

from config import settings

router = APIRouter()


@router.get("/")
async def list_providers() -> dict:
    return {"providers": ["github", "gitlab", "url"]}


@router.get("/github/login")
async def github_login():
    """Redirects the user to GitHub's OAuth authorization page."""
    client_id = settings.github_client_id
    if not client_id:
        raise HTTPException(
            status_code=500,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID in backend/.env.",
        )

    redirect_uri = f"{settings.backend_url}/providers/github/callback"
    params = urlencode(
        {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": "repo user",
        }
    )
    url = f"https://github.com/login/oauth/authorize?{params}"
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(code: str):
    """Exchanges the OAuth code for an access token directly with GitHub."""
    if not settings.github_client_id or not settings.github_client_secret:
        raise HTTPException(
            status_code=500,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env.",
        )

    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"}
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get token from GitHub")
            
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token provided by GitHub")
            
        # Redirect to frontend with token
        return RedirectResponse(f"{settings.frontend_url}/?provider=github&token={access_token}")
