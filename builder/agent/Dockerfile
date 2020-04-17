FROM mhart/alpine-node:12

RUN apk add --no-cache git

RUN adduser -D builder
WORKDIR /home/builder
USER builder

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
COPY agent-conf-docker.json ./agent-conf.json

CMD npm run start