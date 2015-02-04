package poc.core.service.impl;


import poc.core.dao.EmployeeDao;
import poc.core.model.Employee;
import poc.core.service.EmployeeService;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by epotters on 9-10-2014.
 */
public class EmployeeServiceImpl implements EmployeeService {


  EmployeeDao employeeDao;


  public List<Employee> getEmployees() {
    return new ArrayList<Employee>();
  }


}
