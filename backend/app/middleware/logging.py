from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} "
        f"completed in {process_time:.2f}s with status {response.status_code}"
    )
    
    return response
