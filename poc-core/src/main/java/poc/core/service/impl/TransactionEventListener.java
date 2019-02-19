package poc.core.service.impl;


import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class TransactionEventListener {

  @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
  public void handleTransactionEndEvent(TransactionEndEvent transactionEndEvent) {
    System.out.println("Handling event inside a transaction BEFORE COMMIT.");
  }

}
