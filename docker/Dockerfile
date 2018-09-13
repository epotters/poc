FROM openjdk:latest
MAINTAINER epotters@xs4all.nl

# COPY files/UnlimitedJCEPolicyJDK8/* /usr/lib/jvm/java-1.8-openjdk/jre/lib/security/

COPY files/poc-web-api-0.1-SNAPSHOT.jar /opt/spring-cloud/lib/
COPY files/spring-cloud-poc-entrypoint.sh /opt/spring-cloud/bin/
ENV SPRING_APPLICATION_JSON='{"spring": {"cloud": {"config": {"server": \
  {"git": {"uri": "/var/lib/spring-cloud/config-repo", \
  "clone-on-start": true}}}}}}'
ENTRYPOINT ["/usr/bin/java"]
CMD ["-jar", "/opt/spring-cloud/lib/poc-web-api-0.1-SNAPSHOT.jar"]
VOLUME /var/lib/spring-cloud/config-repo
EXPOSE 8888