# install node
FROM node:8

# Create working dir and add everything to it
WORKDIR /app
COPY package.json package-lock.json /app/

# Get our deps
RUN npm install

ADD . /app
RUN npm run build

EXPOSE 4000

ENV FOURSQUARE_API_CLIENT=GDCXNKFB1PLH3CU5MLTEXCPL3LT0FOZL44IPK0B1BBJHPIJ4
ENV FOURSQUARE_API_SECRET=WYXTWA02ZQP3VUXIPKKCSW24Q0AJX3MIKDCF4IZTHNYK1HOI

CMD npm run prod:start-server
