package nl.abz.intranet.visitors.service.impl;


import nl.abz.intranet.visitors.dao.EmployeeDao;
import nl.abz.intranet.visitors.model.Employee;
import nl.abz.intranet.visitors.service.EmployeeService;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by epotters on 9-10-2014.
 */
public class EmployeeServiceImpl implements EmployeeService {


  EmployeeDao employeeDao;


  public List<Employee> getEmployees() {
    return new ArrayList<Employee>();
  };


}
