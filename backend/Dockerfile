FROM node:20
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000

CMD ["npm", "start"]

