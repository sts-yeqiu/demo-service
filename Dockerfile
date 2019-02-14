FROM node:8.11.2

RUN mkdir -p /home/app

COPY ./dist/app.js /home/app
COPY ./node_modules /home/app/node_modules
COPY ./keys /home/app/keys
COPY ./config /home/app/config

# COPY source dest
WORKDIR /home/app 

EXPOSE 9438-9439

CMD ["node", "app.js"]