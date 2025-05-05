FROM ubuntu:24.04

ARG ASTERISK_VERSION=22.3.0

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    wget build-essential git libssl-dev libxml2-dev libncurses5-dev \
    uuid-dev libjansson-dev libedit-dev pkg-config autoconf automake libtool && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m asterisk
WORKDIR /usr/src/asterisk
RUN wget -qO- http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-${ASTERISK_VERSION}.tar.gz \
    | tar xz --strip-components=1

RUN contrib/scripts/install_prereq install && \
    ./configure && \
    menuselect/menuselect --enable res_ari --enable res_ari_applications --enable res_http_websocket menuselect.makeopts && \
    make -j$(nproc) && make install && make samples && make basic-pbx

COPY configs/ /etc/asterisk/

EXPOSE 5060/udp 10000-20000/udp 8088/tcp
CMD ["asterisk", "-f", "-U", "asterisk", "-p"]
