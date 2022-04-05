FROM node:alpine as build-stage
WORKDIR /app
COPY . /app
RUN npm install && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]