FROM node:8-slim
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN yarn install
ENTRYPOINT ["node","index.js"]
