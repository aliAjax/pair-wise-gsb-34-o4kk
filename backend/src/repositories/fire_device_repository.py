from src.seed import seed
class FireDeviceRepository:
    def find_all(self):
        return seed["fireDevice"]
    def find_by_id(self, id):
        for row in seed["fireDevice"]:
            if row["id"] == id:
                return row
        return None
    def find_by_building(self, building_id):
        return [row for row in seed["fireDevice"] if row["building_id"] == building_id]
    def update_status(self, id, status):
        row = self.find_by_id(id)
        if row is None:
            return None
        row["status"] = status
        return row
