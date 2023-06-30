ARG NODE_VERSION=18

# ==== CONFIGURE =====
FROM node:${NODE_VERSION}-alpine as builder
WORKDIR /build/
COPY . .
# needed for dependencies git+ssh
#ARG SSH_PRIVATE_KEY
#RUN mkdir -p /root/.ssh
#RUN echo "${SSH_PRIVATE_KEY}" >> /root/.ssh/id_rsa
#RUN chmod 600 /root/.ssh/id_rsa
#RUN touch /root/.ssh/known_hosts
#RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# ==== BUILD =====
RUN npm i
RUN npm i virtru-oidc-client-js-3.0.0.tgz
#RUN npm run build

# ==== RUN =======
EXPOSE 433
# Start the app
CMD [ "npm", "run", "start-docker" ]

# docker build -t pt:latest .
# docker run -p 433:433 pt:latest