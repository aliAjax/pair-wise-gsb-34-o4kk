from src.seed import seed
class InspectionTaskRepository:
    def find_all(self):
        return seed["inspectionTask"]
    def find_planned(self):
        return [row for row in seed["inspectionTask"] if row["status"] == "PLANNED"]
    def next_id(self):
        return max([row["id"] for row in seed["inspectionTask"]] + [0]) + 1
    def insert(self, row):
        seed["inspectionTask"].append(row)
        return row
