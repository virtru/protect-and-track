ARG NODE_VERSION=18

# ==== CONFIGURE =====
FROM ubuntu:jammy AS builder

# RUN apt-get update && apt-get install -y curl &&\
# apt-get install -y --no-install-recommends sudo &&\
# apt-get install -y --no-install-recommends curl wget gpg &&\
# curl -sL https://deb.nodesource.com/setup_18.x | bash - &&\
# apt-get install -y --no-install-recommends nodejs &&\
# apt-get install -y --no-install-recommends git openssh-client

RUN set -o pipefail && apt-get update && \
  apt-get install -y --no-install-recommends \
    ca-certificates=20230311ubuntu0.22.04.1 \
    curl=7.81.0-1ubuntu1.13 \
    sudo=1.9.9-1ubuntu2.4 \
    gpg=2.2.27-3ubuntu2.1 && \
  curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y --no-install-recommends nodejs=18.17.1-deb-1nodesource1

# Change ownership of the application files to the non-root user
WORKDIR /build/

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
RUN npm i --ignore-scripts &&\
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