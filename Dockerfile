FROM node:18.17.1 as build

ENV TZ Asia/Tokyo
ENV NPM_CONFIG_LOGLEVEL warn

ARG RUN_ENV
ENV RUN_ENV $RUN_ENV

WORKDIR /
COPY . ./
RUN yarn
COPY envs/.env.${RUN_ENV} .env 
RUN npx vite build 


FROM nginx:1.21.1
RUN mkdir -p /nginx_conf
COPY nginx.prod /nginx_conf/production.conf
COPY nginx.stg /nginx_conf/staging.conf
COPY --from=build /dist /usr/share/nginx/${RUN_ENV}/html
EXPOSE 3000
CMD ["/bin/sh", "-c", "ln -snf /nginx_conf/$RUN_ENV.conf /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
