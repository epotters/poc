

Source: https://www.baeldung.com/dockerizing-spring-boot-application


Question: How to copy the artifacts from the build target to the container.



* Create an image from the Dockerfile
docker build --file=Dockerfile --tag=poc:latest --rm=true .

* Create a volume
docker volume create --name=spring-cloud-config-repo

* Run the image
docker run --name=poc --publish=8888:8888 \
     --volume=spring-cloud-config-repo:/var/lib/spring-cloud/config-repo poc:latest