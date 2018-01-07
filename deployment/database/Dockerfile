FROM mongo

##

RUN mkdir /installation
COPY mongodbConfig.js /installation/install.js
COPY fillDB.sh /installation/db.sh
RUN /installation/db.sh
RUN rm -r /installation/
EXPOSE 27017
CMD mongod