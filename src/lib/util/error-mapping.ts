// lib/error-mapping.ts

export type ErrorSource = "PIRAEUS" | "STRIPE" | "MEDUSA" | "GENERAL"

interface ErrorDetail {
  title: string
  message: string
  variant: "error" | "warning" | "info"
}

const GLOBAL_ERROR_MAP: Record<string, ErrorDetail> = {
  // Test Case 2: Declined (ResultCode 0 on failure URL)
  PIRAEUS_0: {
    title: "Η συναλλαγή απορρίφθηκε",
    message:
      "Η τράπεζα απέρριψε τη συναλλαγή. Παρακαλούμε δοκιμάστε μια άλλη κάρτα ή άλλον τρόπο πληρωμής.",
    variant: "error",
  },
  // Test Case 3: MerchantReference already used
  PIRAEUS_1048: {
    title: "Έχει ήδη υποβληθεί",
    message:
      "Αυτός ο κωδικός παραγγελίας έχει ήδη χρησιμοποιηθεί για μια επιτυχημένη πληρωμή.",
    variant: "warning",
  },
  // Test Case 4: Communication Error (50x handled in function logic)
  PIRAEUS_500: {
    title: "Πρόβλημα σύνδεσης με την τράπεζα",
    message:
      "Δεν ήταν δυνατή η επικοινωνία με το σύστημα της τράπεζας. Παρακαλούμε δοκιμάστε ξανά.",
    variant: "error",
  },
  // Test Case 5: Invalid Card
  PIRAEUS_981: {
    title: "Μη έγκυρη κάρτα",
    message:
      "Ο αριθμός της κάρτας δεν είναι έγκυρος ή δεν υποστηρίζεται από το σύστημα.",
    variant: "error",
  },
  // Test Case 6: Under Process
  PIRAEUS_1045: {
    title: "Συναλλαγή σε εξέλιξη",
    message:
      "Αυτή η συναλλαγή βρίσκεται υπό επεξεργασία. Παρακαλούμε περιμένετε λίγο.",
    variant: "info",
  },
  // Test Case 7: Batch Closing
  PIRAEUS_1072: {
    title: "Συντήρηση συστήματος τράπεζας",
    message:
      "Η τράπεζα ολοκληρώνει το ημερήσιο κλείσιμο (batch). Παρακαλούμε δοκιμάστε ξανά σε 15-20 λεπτά.",
    variant: "info",
  },
  // Test Case 8: General Technical Error
  PIRAEUS_1: {
    title: "Τεχνικό σφάλμα",
    message: "Παρουσιάστηκε ένα προσωρινό τεχνικό πρόβλημα. Δεν υπήρξε χρέωση.",
    variant: "error",
  },

  // Medusa / Internal Specific
  MEDUSA_CART_EXPIRED: {
    title: "Το καλάθι έληξε",
    message:
      "Η συνεδρία σας έχει λήξει. Παρακαλούμε δημιουργήστε ξανά το καλάθι σας.",
    variant: "warning",
  },

  // General Fallbacks
  GENERIC_ERROR: {
    title: "Η πληρωμή απέτυχε",
    message:
      "Δεν ήταν δυνατή η επεξεργασία της πληρωμής σας. Παρακαλούμε δοκιμάστε ξανά.",
    variant: "error",
  },
}

export function getErrorMessage(
  source: string | null,
  code: string | null
): ErrorDetail {
  const normalizedSource = (source?.toUpperCase() || "GENERAL") as ErrorSource
  const lookupKey = `${normalizedSource}_${code}`

  // 1. Handle exact Piraeus codes from your Test Cases
  if (GLOBAL_ERROR_MAP[lookupKey]) {
    return GLOBAL_ERROR_MAP[lookupKey]
  }

  // 2. Handle Communication Error Range (Test Case 4: 50x)
  if (normalizedSource === "PIRAEUS" && code?.startsWith("50")) {
    return GLOBAL_ERROR_MAP["PIRAEUS_500"]
  }

  // 3. Fallback for any other 50x errors (Stripe/Internal)
  if (code?.startsWith("50")) {
    return {
      title: "Service Unavailable",
      message: "The payment service is temporarily down.",
      variant: "error",
    }
  }

  // 4. Global Fallback
  return GLOBAL_ERROR_MAP["GENERIC_ERROR"]
}
