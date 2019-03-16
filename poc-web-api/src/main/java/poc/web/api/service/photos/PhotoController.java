package poc.web.api.service.photos;


import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import poc.web.api.service.photos.domain.Photo;


@RestController
@RequestMapping("/api/photos")
public class PhotoController {


  private final PhotoService photoService;

  @Autowired
  PhotoController(PhotoService photoService) {
    this.photoService = photoService;
  }

  @RequestMapping("/{year}/{month}/{day}")
  public Iterable<Photo> listPhotosOnDay(@PathVariable int year, @PathVariable int month, @PathVariable int day) {
    LocalDate dateTaken = LocalDate.of(year, month, day);
    return photoService.getPhotosByDateTaken(dateTaken);
  }


}
