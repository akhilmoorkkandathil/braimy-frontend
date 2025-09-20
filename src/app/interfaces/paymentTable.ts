
export interface PaymentResponse {
    // index:1;
    studentId:string;
    orderId: string;         // Unique identifier for the payment order
    // studentName: string;     // Name of the student associated with the payment
    amountPaid: number;      // Amount paid in the transaction
    date: string;            // Formatted date of the payment (e.g., 'YYYY-MM-DD')
    status: 'completed' | 'cancelled'; // Status of the payment
    // timeRecharged: number;   // Time recharged in hours
    planSelected:string;
}