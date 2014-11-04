package nl.abz.intranet.visitors.service;


import nl.abz.intranet.visitors.model.Employee;

import java.util.List;


/**
 * Created by epotters on 9-10-2014.
 */
public interface EmployeeService {

  List<Employee> getEmployees();
}
