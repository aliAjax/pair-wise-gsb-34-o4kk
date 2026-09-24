from src.seed import seed
class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]
    def find_by_result_ids(self, result_ids):
        return [row for row in seed["hazardTicket"] if row["result_id"] in result_ids]
