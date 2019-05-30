package poc.web.api.controller.dojo;


import java.util.Map;

import lombok.Data;


/*
Fetcher options as sent by the dojo client
{
  "sort": {
    "columnId": "firstName",
    "direction": "desc"
  },
  "filter": {
    "lastName": "bijke",
    "firstName": "jac"
  },
  "offset": 0,
  "size": 100
}
 */


@Data
public class PageableDojoFetchOptions {

  private DojoSort sort;
  private Map<String, String> filter;
  private int offset;
  private int size;


  @Data
  private class DojoSort {
    private String columnId;
    private SortDirection direction;
  }


  private enum SortDirection {ASC, DESC}
}
