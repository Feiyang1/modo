FROM node:16-alpine
WORKDIR /app

RUN apk update && \
    apk add build-base && \
    apk add python3

COPY . ./
RUN npm install

CMD ["npm", "run", "start"]