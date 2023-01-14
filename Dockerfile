FROM node:bullseye-slim

COPY ./app ./app

RUN apt-get update
RUN apt-get install -y openssl libssl-dev

WORKDIR /app

RUN npm i

RUN npm run build

RUN chmod +x start.sh

CMD ["sh", "start.sh"]
