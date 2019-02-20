package poc.web.api.service.photos;


import java.time.LocalDateTime;

import lombok.Data;


@Data
class Photo {

  private String uuid;
  private String name;
  private String path;
  private LocalDateTime dateTaken;

}
