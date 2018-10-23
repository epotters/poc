package poc.jobs.genealogy;


import org.gedcom4j.exception.GedcomWriterException;
import org.gedcom4j.model.Family;
import org.gedcom4j.model.FamilyChild;
import org.gedcom4j.model.FamilySpouse;
import org.gedcom4j.model.Gedcom;
import org.gedcom4j.model.Individual;
import org.gedcom4j.model.IndividualEvent;
import org.gedcom4j.model.IndividualReference;
import org.gedcom4j.model.PersonalName;
import org.gedcom4j.model.Place;
import org.gedcom4j.model.StringWithCustomFacts;
import org.gedcom4j.model.Submitter;
import org.gedcom4j.model.enumerations.IndividualEventType;
import org.gedcom4j.validate.Validator;
import org.gedcom4j.validate.Validator.Finding;
import org.gedcom4j.writer.GedcomWriter;


/**
 * Creates a GEDCOM from scratch.
 * Source: http://gedcom4j.org/main/example-creating-gedcom-scratch
 *
 * @author frizbog
 */
public class GedcomBuilder {

  /**
   * A counter for individual xref numbers
   */
  private static int individualCounter;


  /**
   * Main method
   *
   * @param args
   *     command line arguments
   * @throws GedcomWriterException
   *     if the file cannot be written
   */
  public static void main(String[] args) throws GedcomWriterException {
    Gedcom g = new Gedcom();

    // Gedcoms require a submitter
    Submitter s = new Submitter();
    s.setXref("@SUBM@"); // Some unique xref for a submitter
    s.setName(new StringWithCustomFacts("Matt /Harrah/"));
    // Use the xref as the map key
    g.getSubmitters().put(s.getXref(), s);

    // Add three people - a husband, wife, and kid. First add the
    // individuals.
    Individual husband = createIndividual("Skywalker", "Anakin", "1967", "Suffolk, Virginia, USA");
    husband.setSex(new StringWithCustomFacts("Male"));
    // Use the xref as the map key
    g.getIndividuals().put(husband.getXref(), husband);

    Individual wife = createIndividual("Amidala", "Padme", "1967", "Chesapeake, Virginia, USA");
    wife.setSex(new StringWithCustomFacts("Female"));
    // Use the xref as the map key
    g.getIndividuals().put(wife.getXref(), wife);

    Individual kid = createIndividual("Skywalker", "Luke", "1995", "Chesapeake, Virginia, USA");
    kid.setSex(new StringWithCustomFacts("Male"));
    // Use the xref as the map key
    g.getIndividuals().put(kid.getXref(), kid);

    // Now put them in a family
    Family f = new Family();
    f.setXref("@F1@"); // Some unique xref for the family

    // Add the husband to the family, and the family reference to
    // the husband
    f.setHusband(new IndividualReference(husband));
    FamilySpouse fsh = new FamilySpouse();
    fsh.setFamily(f);
    husband.getFamiliesWhereSpouse(true).add(fsh);

    // Add the wife to the family, and the family reference to the
    // wife
    f.setWife(new IndividualReference(wife));
    FamilySpouse fsw = new FamilySpouse();
    fsw.setFamily(f);
    wife.getFamiliesWhereSpouse(true).add(fsw);

    // Add the child to the family, and the family reference to the
    // child
    f.getChildren(true).add(new IndividualReference(kid));
    FamilyChild fc = new FamilyChild();
    fc.setFamily(f);
    kid.getFamiliesWhereChild(true).add(fc);

    // Add the family to the families collection
    g.getFamilies().put(f.getXref(), f);

    // Check that everything's fine before writing
    Validator gv = new Validator(g);
    gv.validate();
    if (!gv.getResults().getAllFindings().isEmpty()) {
      // There were some problems, so display them on stderr
      for (Finding finding : gv.getResults().getAllFindings()) {
        System.err.println(finding);
      }
    }
    else {
      // No problems so write the GEDCOM file out to stdout
      GedcomWriter gw = new GedcomWriter(g);
      gw.write(System.out);
    }
  }


  /**
   * A helper method that shows how to make an individual based on
   * some basic parameter
   *
   * @param lastName
   *     the individual's last name
   * @param firstName
   *     the individual's first name
   * @param birthDate
   *     the individual's birthdate
   * @param location
   *     the individual's birth location
   * @return the newly created individual
   */
  private static Individual createIndividual(String lastName, String firstName, String birthDate, String location) {
    Individual i = new Individual();

    /*
     * Individuals, like most objects, need xref values. They begin
     * and end with @-signs, and need to be unique
     */
    individualCounter++;
    i.setXref("@I" + individualCounter + "@");

    // Set the name
    PersonalName name = new PersonalName();
    name.setBasic(firstName + " /" + lastName + "/"); // Basic is
    // required
    name.setSurname(new StringWithCustomFacts(lastName));
    name.setGivenName(new StringWithCustomFacts(firstName));
    i.getNames(true).add(name);

    // Add a birthdate and location
    IndividualEvent event = new IndividualEvent();
    event.setDate(new StringWithCustomFacts(birthDate));
    event.setPlace(new Place());
    event.getPlace().setPlaceName(location);
    event.setType(IndividualEventType.BIRTH);
    i.getEvents(true).add(event);

    return i;
  }

}