package poc.web.api.service.photos;


import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;


/**
 *
 * Select photos from year, month and date file structures
 *
 */

@Service
public interface PhotoService {


  List<Photo> getPhotosByDateTaken(LocalDate dateTaken);


  void setPhotosBasePath(String photosBasePath);

}
