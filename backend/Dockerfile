FROM python:3.10

# Create a non-root user (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user

# Set environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    U2NET_HOME=/home/user/.u2net

WORKDIR $HOME/app

# Copy requirement and install
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY --chown=user:user . .

# Run the app mapping to standard Hugging Face API port
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
