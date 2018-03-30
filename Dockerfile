from node:8-alpine

# Create app dir
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Bundle app source
COPY . /usr/app

# Install dependencies
RUN npm install

# Run app
CMD ["npm", "start"]