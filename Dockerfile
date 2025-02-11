FROM node:22 as step01
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build
FROM nginx:1.27.1
COPY --from=step01 /src/dist /usr/share/nginx/html