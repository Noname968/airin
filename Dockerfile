FROM node:latest

WORKDIR /home/node/app

RUN git clone https://github.com/Luckyhv/aniplay.git . &&\
    npm install

EXPOSE 3000

VOLUME /home/node/app

ENTRYPOINT npm run dev
