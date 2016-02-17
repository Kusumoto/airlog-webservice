
FROM node:latest

COPY . /app/samf-webservice

WORKDIR /app/samf-webservice

RUN npm install

COPY docker-entrypoint.sh /app/samf-webservice/entrypoint.sh

RUN chmod 777 entrypoint.sh

ENTRYPOINT ["/app/samf-webservice/entrypoint.sh"]

EXPOSE 8080

CMD npm start