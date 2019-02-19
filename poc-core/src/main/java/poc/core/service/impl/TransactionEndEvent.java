package poc.core.service.impl;


public class TransactionEndEvent<T> {
  private T what;
  protected String message;
  protected boolean success;

  public TransactionEndEvent(T what, boolean success) {
    this.what = what;
    this.success = success;
  }

  public TransactionEndEvent(T what, String message, boolean success) {
    this.what = what;
    this.success = success;
    this.message = message;
  }
}
