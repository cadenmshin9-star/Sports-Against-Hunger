import { getDb } from "./index";
import {
  donationRefunds,
  donationTransactions,
  type NewDonationRefund,
  type NewDonationTransaction,
} from "./schema";

export async function insertDonationTransaction(
  transaction: NewDonationTransaction,
) {
  const [inserted] = await getDb()
    .insert(donationTransactions)
    .values(transaction)
    .onConflictDoNothing({
      target: donationTransactions.externalTransactionId,
    })
    .returning({ id: donationTransactions.id });

  return Boolean(inserted);
}

export async function insertDonationRefund(refund: NewDonationRefund) {
  const [inserted] = await getDb()
    .insert(donationRefunds)
    .values(refund)
    .onConflictDoNothing({ target: donationRefunds.externalRefundId })
    .returning({ id: donationRefunds.id });

  return Boolean(inserted);
}
