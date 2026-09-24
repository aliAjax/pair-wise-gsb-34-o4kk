from src.seed import seed
class InspectionResultRepository:
    def find_all(self):
        return seed["inspectionResult"]
    def find_by_device(self, device_id):
        return [row for row in seed["inspectionResult"] if row["device_id"] == device_id]
    def next_id(self):
        return max([row["id"] for row in seed["inspectionResult"]] + [0]) + 1
    def insert(self, row):
        seed["inspectionResult"].append(row)
        return row
    def delete_for_tasks(self, task_ids, device_id, protected_result_ids=None):
        protected = set(protected_result_ids or [])
        kept = []
        removed = 0
        for row in seed["inspectionResult"]:
            if row["device_id"] == device_id and row["task_id"] in task_ids and row["id"] not in protected:
                removed += 1
            else:
                kept.append(row)
        seed["inspectionResult"][:] = kept
        return removed
