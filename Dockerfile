ARG NODE_VERSION=18

# ==== CONFIGURE =====
FROM ubuntu:jammy as builder

RUN groupadd -g 1000 nonroot && useradd -u 1000 -g nonroot -m nonroot

RUN apt-get update && apt-get install -y curl && apt-get install sudo &&\
apt-get install -y --no-install-recommends curl wget gpg &&\
curl -sL https://deb.nodesource.com/setup_18.x | bash - &&\
apt-get install -y --no-install-recommends nodejs &&\
apt-get install -y --no-install-recommends git openssh-client

# Change ownership of the application files to the non-root user
WORKDIR /build/
#RUN chown -R myuser:myuser /build
#USER myuser

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

#COPY . .
COPY /e2e /build/e2e
COPY /src /build/src
COPY /virtru-oidc-client-js-3.0.0.tgz /build
COPY /accounts.json /build
COPY /package.json /build
COPY /package-lock.json /build
COPY /wait-for-it.sh /build
COPY /playwright.config.ts /build
COPY /public /build/public

# ==== BUILD =====
#RUN mkdir -p node_modules/ && chmod -R 777 node_modules/
RUN npm i --ignore-scripts &&\
npm i --ignore-scripts virtru-oidc-client-js-3.0.0.tgz &&\
npx playwright install &&\
npx playwright install-deps &&\
npm run build

## ==== RUN =======
EXPOSE 443

USER nonroot
#RUN ["chmod", "+x", "./entrypoint.sh"]
#ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "ci-e2e-test"]

# docker build -t pt:latest .
# docker run --name protect-and-track --add-host=local.virtru.com:127.0.0.1 -it pt:latest
# docker exec -it protect-and-track sh npm run playwright-test