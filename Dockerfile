FROM node:4-slim
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN yarn install
CMD ["node","index.js"]
