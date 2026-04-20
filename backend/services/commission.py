import math

COMMISSION_RATE = 0


class CommissionCalculator:

    @staticmethod
    def commission_paid(order_sum_amount: int) -> int:
        """Amount charged when submitting a response.
        All amounts in kopecks."""
        return math.ceil(order_sum_amount * COMMISSION_RATE / 100)

    @staticmethod
    def final_commission(proposed_sum_amount: int) -> int:
        """Final commission after acceptance."""
        return math.ceil(proposed_sum_amount * COMMISSION_RATE / 100)

    @staticmethod
    def balance_return(order_sum_amount: int) -> int:
        """Amount returned to the expert when funds should be released."""
        return CommissionCalculator.commission_paid(order_sum_amount)
