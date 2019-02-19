package poc.core.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;


@Component
public class TransactionEndEventPublisher {

  private ApplicationEventPublisher applicationEventPublisher;


  @Autowired
  TransactionEndEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
    this.applicationEventPublisher = applicationEventPublisher;
  }


  public void doStuffAndPublishAnEvent(final String message) {
    System.out.println("Publishing custom event. ");
    TransactionEndEvent transactionEndEvent = new TransactionEndEvent(this, message, true);
    applicationEventPublisher.publishEvent(transactionEndEvent);
  }

}

