FROM node:12.14-alpine

# set environment
ENV USER=node 
ENV WORKDIR=/home/node/app

# set workdir application
WORKDIR ${WORKDIR}

# create directory app and permission
RUN mkdir -p ${WORKDIR}
RUN chown -R ${USER}:${USER} ${WORKDIR}

# install global yarn dependencies
# RUN yarn global add pm2 typescript nodemon

# copy package.json
COPY package.json .
COPY yarn.lock .

# update system and install dependencies
RUN apk add --update alpine-sdk python vips-tools vips-dev fftw-dev gcc g++ make libc6-compat && \
    yarn install --silent --pure-lockfile && \
    yarn cache clean && \
    apk del alpine-sdk python vips-dev fftw-dev gcc g++ make && \
    rm -rf /var/cache/apk/*

# copy all project files to working directory
COPY . .
COPY --chown=${USER}:${USER} . .
RUN chown -R ${USER}:1000 ${WORKDIR}

# set user
USER ${USER}

# start application
CMD ${START_COMMAND}
