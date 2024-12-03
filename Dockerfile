FROM node:lts as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run compile

FROM node:lts-slim as production

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080
CMD [ "node", "dist/index.js" ]