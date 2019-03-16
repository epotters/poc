package poc.web.api.service.photos.domain;


import java.util.List;

import lombok.Data;


@Data
public class Album {

  private String displayName;
  private PhotoLibrary library;
  private List<Photo> photos;

}
