FROM ccr.ccs.tencentyun.com/jiuniang/static-server:1

COPY . /usr/src/app/client

RUN make build-client

EXPOSE 8000

CMD ["npm", "run", "start" ]


