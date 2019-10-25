package poc.jobs.docker;


import java.io.File;
import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;


public class DockerComposeReader {

  private String filePath = "environments/dev//docker-compose.yml";

  public DockerComposeFile readDockerComposeFile(String filePath) throws IOException {
    final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    mapper.findAndRegisterModules();
    return mapper.readValue(new File(filePath), DockerComposeFile.class);
  }

}
