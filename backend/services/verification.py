import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

class InterswitchClient:

    def __init__(self):
        self.auth_url = settings.INTERSWITCH_AUTH_URL
        self.verify_cac_url = settings.INTERSWITCH_VERIFY_CAC_URL
        self.client_id = settings.INTERSWITCH_CLIENT_ID
        self.client_secret = settings.INTERSWITCH_CLIENT_SECRET
        self.timeout = 15

    def authenticate(self) -> str:
        """
        Fetch OAuth token from Interswitch
        """

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }

        data = {
            "grant_type": "client_credentials"
        }

        try:
            response = requests.post(
                self.auth_url,
                headers=headers,
                data=data,
                auth=(self.client_id, self.client_secret),
                timeout=self.timeout,
            )

            response.raise_for_status()

            token = response.json().get("access_token")

            if not token:
                logger.error("Interswitch auth succeeded but no token returned")
                raise ValueError("No access_token returned from Interswitch")

            return token

        except requests.exceptions.RequestException as exc:
            logger.error(f"Interswitch auth failed: {str(exc)}")
            raise RuntimeError("Failed to authenticate with Interswitch") from exc

    def verify_cac(self, token: str, company_name: str) -> dict:
        """
        Verify passport details using Interswitch API
        """

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        try:
            
            logger.info(f"Calling CAC API URL: {self.verify_cac_url} with companyName={company_name}")
            response = requests.get(
                self.verify_cac_url,
                headers=headers,
                params={"companyName": company_name},
                timeout=self.timeout,
            )

            if response.status_code >= 400:
                logger.error(
                    f"CAC verification failed | "
                    f"Status: {response.status_code} | "
                    f"Response: {response.text}"
                )

                return {
                    "status": "error",
                    "status_code": response.status_code,
                    "provider_response": response.json() if response.text else None,
                }
            
            data = response.json()

            return {
                "status": "success",
                "is_valid": data.get("responseCode") == "00",
                "company_name": data.get("companyName"),
                "raw": data,
            }

        except requests.exceptions.Timeout:
            logger.error("CAC verification timed out")
            return {"status": "error", "message": "Verification request timed out"}

        except requests.exceptions.RequestException as exc:
            logger.error(f"CAC verification error: {str(exc)}")
            return {"status": "error", "message": str(exc)}


def verify_nin(nin):
    if nin:
        return True
    
    return False