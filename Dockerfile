FROM node:20.9.0-alpine as dev-stage
LABEL authors="chornthorn"

# environment variables
ARG KEYCLOAK_TOKEN_URL
ARG KEYCLOAK_CLIENT_ID
ARG RSA_PUBLIC_KEY

ENV KEYCLOAK_TOKEN_URL=${KEYCLOAK_TOKEN_URL}
ENV KEYCLOAK_CLIENT_ID=${KEYCLOAK_CLIENT_ID}
ENV RSA_PUBLIC_KEY=${RSA_PUBLIC_KEY}

# Create app directory
RUN mkdir -p /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# build app
RUN pnpm run build

FROM node:20.9.0-alpine as  prod-stage
LABEL authors="chornthorn"

# Create app directory
RUN mkdir -p /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --prod

# remove pnpm global
RUN npm uninstall -g pnpm

# Copy source code
COPY --from=dev-stage /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "start:prod"]