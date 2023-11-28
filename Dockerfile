FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
# ARG SHOPIFY_API_SECRET
# ENV SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET
# ARG SCOPES
# ENV SCOPES=$SCOPES
# ARG HOST
# ENV HOST=$HOST
# ARG SHOPIFY_APP_URL
# ENV SHOPIFY_APP_URL=$SHOPIFY_APP_URL
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
