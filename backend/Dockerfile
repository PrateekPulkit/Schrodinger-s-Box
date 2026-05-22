FROM python:3.11-slim

WORKDIR /app

# Install build dependencies for cryptography, liboqs, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libssl-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Build liboqs from source to ensure proper linking
RUN git clone -b main https://github.com/open-quantum-safe/liboqs.git && \
    cd liboqs && mkdir build && cd build && \
    cmake -DOQS_USE_OPENSSL=0 .. && make -j4 && make install && \
    cd ../.. && rm -rf liboqs

ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

RUN git clone https://github.com/open-quantum-safe/liboqs-python.git && \
    cd liboqs-python && pip install . && cd .. && rm -rf liboqs-python

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
