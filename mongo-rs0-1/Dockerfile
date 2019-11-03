FROM mongo:4.2

# Working config directory
WORKDIR /usr/src/configs

COPY ./mongo.conf .

EXPOSE 27010

# CMD Instruction
CMD ["--config", "./mongo.conf"]