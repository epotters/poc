package poc.web.api.service.photos;


import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import poc.web.api.service.photos.domain.Photo;


@Component
public class PhotoServiceImpl implements PhotoService {

  private String photosBasePath;


  @Override
  public void setPhotosBasePath(String photosBasePath) {
    this.photosBasePath = photosBasePath;
  }


  @Override
  public List<Photo> getPhotosByDateTaken(LocalDate dateTaken) {
    List<Photo> photos = new ArrayList<>();

    String photoDayPathTxt = photosBasePath + DateTimeFormatter.ofPattern("yyyy/MM/dd/").format(dateTaken);
    Path photoDayPath = Paths.get(photoDayPathTxt);

    File photoDayDir = new File(photoDayPathTxt);
    File[] photoFiles = photoDayDir.listFiles();

    if (photoFiles != null) {
      for (File photoFile : photoFiles) {
        photos.add(getPhotoForFile(photoFile));
      }
    }
    return photos;
  }


  private Photo getPhotoForFile(File photoFile) {
    Photo photo = new Photo();
    photo.setName(photoFile.getName());
    photo.setPath(photoFile.getAbsolutePath());
    return photo;
  }
}
