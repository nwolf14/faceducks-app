FROM node:10.0.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm install -g nodemon
RUN npm install -g typescript

COPY package.json /usr/src/app/package.json

RUN npm install --silent

CMD [ "npm", "run", "qa" ]
