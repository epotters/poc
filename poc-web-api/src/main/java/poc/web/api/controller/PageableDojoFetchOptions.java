package poc.web.api.controller;


/*

Example dojo request payload
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

import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.Optional;

import lombok.Data;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;


@Data
public class PageableDojoFetchOptions {//implements Pageable {

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


  // Pageable implementation

//
//  @Override
//  public int getPageNumber() {
//    return (offset / size);
//  }
//
//  @Override
//  public int getPageSize() {
//    return size;
//  }
//
//  @Override
//  @NonNull
//  public Pageable next() {
//
//
//    return null;
//  }
//
//  @Override
//  @NonNull
//  public Pageable previousOrFirst() {
//    return null;
//  }
//
//  @Override
//  @NonNull
//  public Pageable first() {
//    return null;
//  }
//
//  @Override
//  public boolean hasPrevious() {
//    return (getPageNumber() > 0);
//  }
//
//  @Override
//  public boolean isPaged() {
//    return true;
//  }
//
//  @Override
//  public boolean isUnpaged() {
//    return false;
//  }
//
//  @Override
//  @NonNull
//  public Sort getSortOr(Sort sort) {
//    return Sort.by(getSort().getColumnId());
//  }
//
//  @Override
////  @NonNullApi
//  @NotNull
//  public Optional<Pageable> toOptional() {
//    return Optional.empty();
//  }
}
