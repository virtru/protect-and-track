ARG NODE_VERSION=18

# ==== CONFIGURE =====
FROM ubuntu:jammy as builder
#FROM node:${NODE_VERSION}-alpine as builder

RUN apt-get update && \
    # Install Node 18
    apt-get install -y curl wget gpg && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    # Feature-parity with node.js base images.
    apt-get install -y --no-install-recommends git openssh-client && \
    # clean apt cache
    rm -rf /var/lib/apt/lists/* && \
    # Create the pwuser
    adduser pwuser

#RUN mkdir /ms-playwright && \
#    mkdir /ms-playwright-agent && \
#    cd /ms-playwright-agent && npm init -y && \
#    npm i /tmp/playwright-core.tar.gz && \
#    npm exec --no -- playwright-core mark-docker-image "${DOCKER_IMAGE_NAME_TEMPLATE}" && \
#    npm exec --no -- playwright-core install --with-deps && rm -rf /var/lib/apt/lists/* && \
#    rm /tmp/playwright-core.tar.gz && \
#    rm -rf /ms-playwright-agent && \
#    chmod -R 777 /ms-playwright
# === BAKE BROWSERS INTO IMAGE ===

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# 1. Add tip-of-tree Playwright package to install its browsers.
#    The package should be built beforehand from tip-of-tree Playwright.
#COPY ./playwright-core.tar.gz /tmp/playwright-core.tar.gz

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
RUN npm i virtru-oidc-client-js-3.0.0.tgz
RUN npm i
RUN npx playwright install
#RUN npm run build

## ==== RUN =======
EXPOSE 443
CMD [ "npm", "run", "start-docker" ]

# docker build -t pt:latest .
# docker run --add-host=local.virtru.com:127.0.0.1 -p 443:3000 pt:latest