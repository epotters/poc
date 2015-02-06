import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import poc.core.repository.PersonRepository;

/**
 * Created by eelko on 06-02-2015.
 */

@RunWith(MockitoJUnitRunner.class)
// @ContextConfiguration(classes = {TestContext.class})

public class PersonRepositoryTest {


    @Autowired
    private PersonRepository personepository;

    @Test
    public void TestServices() throws Exception {

      /*
      RoleDetails first = new RoleDetails();
      first.setId("1");
      first.setDescription("First Description");
      first.setName("First");
      roleRepository.saveAndFlush(new RoleEntity(first));
      roleRepository.save(new RoleEntity(first));
      List<RoleEntity> roles = new ArrayList<RoleEntity>();
      roles = roleRepository.findAll();
      System.out.println(roles);
      assertEquals(1, roles.size());
      */
    }

}
