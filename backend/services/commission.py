import math

COMMISSION_RATE = 5


class CommissionCalculator:

    @staticmethod
    def commission_paid(order_sum_amount: int) -> int:
        """Deposit the expert pays when submitting a response = ceil(5% of order sum).
        All amounts in kopecks."""
        return math.ceil(order_sum_amount * COMMISSION_RATE / 100)

    @staticmethod
    def final_commission(proposed_sum_amount: int) -> int:
        """Final commission after acceptance = ceil(5% of expert's proposed sum)."""
        return math.ceil(proposed_sum_amount * COMMISSION_RATE / 100)

    @staticmethod
    def balance_return(order_sum_amount: int) -> int:
        """Full deposit is returned to expert upon acceptance."""
        return CommissionCalculator.commission_paid(order_sum_amount)
