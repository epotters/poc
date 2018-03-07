package poc.rest.controller;


import java.util.Map;

import lombok.Getter;


@Getter
public class ErrorResponseBody {

  private Integer status;
  private String error;
  private String message;
  private String timeStamp;
  private String trace;

  private String path;
  private String exception;

  private String errorKey;

/*
{
  timestamp=Sun Oct 29 13:18:54 CET 2017,
  status=401,
  error=Unauthorized,
  message=Unauthorized,
  path=/poc/api/persons
}
 */


  public ErrorResponseBody(int status, Map<String, Object> errorAttributes) {
    this.status = status;
    this.error = (String) errorAttributes.get("error");
    this.message = (String) errorAttributes.get("message");
    this.timeStamp = errorAttributes.get("timestamp").toString();
    this.trace = (String) errorAttributes.get("trace");

    this.path = (String) errorAttributes.get("path");

    this.exception = (String) errorAttributes.get("exception");
  }

}
