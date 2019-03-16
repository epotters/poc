package poc.web.api.service.photos;


import java.time.LocalDate;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import poc.web.api.service.photos.domain.Photo;


public class PhotoServiceImplTest {

  @Autowired
  PhotoService photoService;


  @Test
  public void getPhotosByDateTaken() {

    String masterPath =
        "C:\\dev\\Work\\home\\poc\\poc-web-api\\src\\test\\resources\\test-data\\photo-libraries\\" +
            "master-photo-library\\Masters\\";

    photoService.setPhotosBasePath(masterPath);

    LocalDate dateToFind = LocalDate.of(2019, 3, 23);

    List<Photo> photos = photoService.getPhotosByDateTaken(dateToFind);

    Assert.assertEquals("Wrong number of photos", photos.size(), 7);
  }
}
