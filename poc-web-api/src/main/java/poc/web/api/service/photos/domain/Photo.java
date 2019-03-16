package poc.web.api.service.photos.domain;


import java.time.LocalDateTime;

import lombok.Data;


@Data
public class Photo {

  private String uuid;
  private String name;
  private String path;
  private LocalDateTime dateTaken;

}
