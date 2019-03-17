FROM harbor-dev.hfjy.com:5050/base/nginx:1.14
MAINTAINER Alan.li "alan@hfjy.com"
COPY ./pad /usr/share/nginx/html/pad
COPY ./phone /usr/share/nginx/html/phone
COPY ./activitys /usr/share/nginx/html/activitys
COPY ./common /usr/share/nginx/html/common
COPY ./config /usr/share/nginx/html/config
COPY ./landings /usr/share/nginx/html/landings
COPY ./pc /usr/share/nginx/html/pc
COPY ./phone_official /usr/share/nginx/html/phone_official
COPY ./static /usr/share/nginx/html/static
COPY ./package.json /usr/share/nginx/html/package.json
COPY ./cp.sh /usr/share/nginx/html/cp.sh

EXPOSE 80
