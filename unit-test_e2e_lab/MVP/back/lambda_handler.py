import os
import logging
from mangum import Mangum
from src.main import app

# Configure logging level for Lambda
logging.basicConfig(level=logging.INFO)
logging.getLogger().setLevel(logging.INFO)

# Load environment variables from Lambda environment
os.environ.setdefault("AWS_LAMBDA_FUNCTION_NAME", "true")

# Create the Lambda handler
handler = Mangum(app, lifespan="off")
