FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g json-server concurrently serve

COPY . .

EXPOSE 5000 3000

CMD concurrently "json-server db.json --static ./data --port 3000" "vite build" "serve -s dist -l 5000"