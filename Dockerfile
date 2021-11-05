FROM ccr.ccs.tencentyun.com/jiuniang/static-server:2.1

# ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY ./build /usr/src/app/client/build

# RUN rm -rf /usr/src/app/client/build
#push
RUN make build-client

EXPOSE 8000

CMD ["npm", "run", "start" ]