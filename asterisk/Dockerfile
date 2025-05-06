FROM debian:bullseye

ENV ASTERISK_VERSION=22.3.0

# Install dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl wget gnupg2 ca-certificates build-essential \
    libedit-dev libjansson-dev libxml2-dev uuid-dev \
    libssl-dev libncurses5-dev pkg-config subversion \
    python3 sudo libsqlite3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create asterisk user
RUN useradd -m asterisk

# Download and extract Asterisk source
WORKDIR /usr/src
RUN wget https://downloads.asterisk.org/pub/telephony/asterisk/asterisk-${ASTERISK_VERSION}.tar.gz && \
    tar -xzf asterisk-${ASTERISK_VERSION}.tar.gz && \
    rm asterisk-${ASTERISK_VERSION}.tar.gz

# Build Asterisk with ARI and sounds
WORKDIR /usr/src/asterisk-${ASTERISK_VERSION}
RUN contrib/scripts/get_mp3_source.sh && \
    ./configure && \
    make menuselect && \
    menuselect/menuselect --enable res_http_websocket \
                          --enable res_ari \
                          --enable res_ari_applications \
                          --enable res_ari_asterisk \
                          --enable res_ari_bridges \
                          --enable res_ari_channels \
                          --enable res_ari_device_states \
                          --enable res_ari_endpoints \
                          --enable res_ari_events \
                          --enable res_ari_model \
                          --enable res_ari_playbacks \
                          --enable res_ari_recordings \
                          --enable res_ari_sounds \
                          --enable CORE-SOUNDS-EN-ULAW \
                          menuselect.makeopts && \
    make -j$(nproc) && make install && make samples && make config

# Set working directory to Asterisk config dir
WORKDIR /etc/asterisk

# Switch to non-root user
USER asterisk

# Expose required ports
EXPOSE 5060/udp 10000-20000/udp 8088/tcp

# Run Asterisk in foreground
CMD ["asterisk", "-f", "-U", "asterisk", "-p"]
