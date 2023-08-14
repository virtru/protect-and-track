ARG NODE_VERSION=18

# ==== CONFIGURE =====
FROM ubuntu:jammy as builder

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot
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
COPY ./e2e .
COPY ./src .
COPY ./virtru-oidc-client-js-3.0.0.tgz /
COPY ./package.json /
COPY ./package-lock.json /
COPY ./wait-for-it.sh /
COPY ./playwright.config.ts /

# ==== BUILD =====
RUN npm i virtru-oidc-client-js-3.0.0.tgz &&\
npm i &&\
npx playwright install &&\
npx playwright install-deps &&\
npm run build

## ==== RUN =======
EXPOSE 443

#RUN ["chmod", "+x", "./entrypoint.sh"]
#ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "ci-e2e-test"]

# docker build -t pt:latest .
# docker run --name protect-and-track --add-host=local.virtru.com:127.0.0.1 -it pt:latest
# docker exec -it protect-and-track sh npm run playwright-test