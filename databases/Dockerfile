FROM node:7.2.0-wheezy

ENV APP_HOME /trw_databases

COPY . $APP_HOME

ENV NODE_ENV development
ENV PORT 3000

WORKDIR $APP_HOME

RUN npm install

RUN /bin/bash -c "echo TERM=xterm" >> ~/.bashrc
RUN /bin/bash -c "echo alias ll=\'ls -la\'" >> ~/.bashrc