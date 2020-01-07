FROM node:12.14-alpine

# set environments
ENV USER=node
ENV WORKDIR=/home/node/app
ENV TZ=America/Sao_Paulo
ENV NPM_LOCK_FILE=yarn.lock
ENV NPM_START_COMMAND='yarn start'
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_INSTALL_COMMAND='yarn install --silent --pure-lockfile'
ENV NPM_CLEAR_CACHE_COMMAND='yarn cache clean'
ENV NPM_INSTALL_GLOBAL_COMMAND='yarn global add pm2 typescript nodemon'

# set workdir application
WORKDIR ${WORKDIR}

# create directory app and permission
RUN mkdir -p ${WORKDIR}
RUN chown -R ${USER}:${USER} ${WORKDIR}

# install global dependencies
RUN ${NPM_INSTALL_GLOBAL_COMMAND}

# copy package.json
COPY package.json .
COPY ${NPM_LOCK_FILE} .

# update system and install dependencies
RUN apk add --update --no-cache tzdata alpine-sdk python vips-tools vips-dev fftw-dev gcc g++ make libc6-compat && \
    ${NPM_INSTALL_COMMAND} && ${NPM_CLEAR_CACHE_COMMAND} && \
    apk del alpine-sdk python vips-dev fftw-dev gcc g++ make libc6-compat && \
    rm -rf /var/cache/apk/*

# copy all project files to working directory
COPY . .
COPY --chown=${USER}:${USER} . .
RUN chown -R ${USER}:1000 ${WORKDIR}

# set user
USER ${USER}

# start application
CMD ${NPM_START_COMMAND}
