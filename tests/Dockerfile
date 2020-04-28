FROM ubuntu:18.04

RUN apt-get update 
RUN apt-get install -y \
  curl \
  openjdk-11-jdk \
  git \
  build-essential

RUN apt-get install -y sudo

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

RUN sudo apt-get install -y nodejs

RUN mkdir /hermione
WORKDIR /hermione

COPY package.json ./
COPY ./plugins ./plugins
RUN npm install

COPY .hermione.conf.js ./