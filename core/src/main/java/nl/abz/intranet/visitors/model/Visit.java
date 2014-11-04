package nl.abz.intranet.visitors.model;


import java.util.Date;
import java.util.List;


/**
 * Created by epotters on 22-9-2014.
 */
public class Visit {

  Date startDate;
  Date endDate;
  String subject;

  Employee organizer;
  Employee owner;
  Visitor visitor;

}
