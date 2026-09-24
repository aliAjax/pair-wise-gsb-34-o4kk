from src.seed import seed
from src.constants.outage_status import ACTIVE_OUTAGE_STATUS

class DeviceOutageRepository:
    def find_all(self):
        return seed["deviceOutage"]
    def find_by_id(self, id):
        for row in seed["deviceOutage"]:
            if row["id"] == id:
                return row
        return None
    def find_active_by_device(self, device_id):
        return [row for row in seed["deviceOutage"] if row["device_id"] == device_id and row["status"] in ACTIVE_OUTAGE_STATUS]
    def next_id(self):
        return max([row["id"] for row in seed["deviceOutage"]] + [0]) + 1
    def insert(self, row):
        seed["deviceOutage"].append(row)
        return row
