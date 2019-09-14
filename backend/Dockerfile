FROM node:10.0.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm install -g nodemon

# install and cache app dependencies
COPY package.json /usr/src/app/package.json

RUN npm install --silent

CMD [ "npm", "start" ]
