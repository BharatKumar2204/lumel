#  Lumel Backend Developer Coding assessment
---

##  Base URL

```
https://lumel.onrender.com
```

---

##  Import Data API

### Endpoint

```
GET /api/import-data
```

### Description

Uploads and imports data from a CSV file into the database. This must be a valid CSV formatted as expected by the schema.


### Request Body

No body is required (or if uploading via a client, attach a file named `file`).

### Response

```json
{
  "message": "Data imported successfully"
}
```

---

##  Get Top Products API

### Endpoint

```
GET /api/top-products
```

### Description

Fetches top N products based on sales. You can group results by category or region and limit the number of results returned.

### Query Parameters

| Parameter   | Type   | Required | Description                                         |
|-------------|--------|----------|-----------------------------------------------------|
| `startDate` | String | Yes      | Start date in `YYYY-MM-DD` format                   |
| `endDate`   | String | Yes      | End date in `YYYY-MM-DD` format                     |
| `groupBy`   | String | No       | `overall` or `category` or `region` (for grouping)  |
| `limit`     | Number | No       | Limit the number of results (default: 5)            |

### Sample API Calls

####  Top 5 Products Overall

```bash
GET /api/top-products?startDate=2024-01-01&endDate=2024-12-31
```

####  Top 3 Products by Category

```bash
GET /api/top-products?startDate=2024-01-01&endDate=2024-12-31&groupBy=category&limit=3
```

####  Top 10 Products by Region

```bash
GET /api/top-products?startDate=2024-01-01&endDate=2024-12-31&groupBy=region&limit=10
```

### Sample Response

```json
[
  {
    "name": "Product A",
    "sales": 12345,
    "category": "Electronics",
    "region": "South"
  }
]
```

---

##  API Summary Table

| Endpoint                          | Method | Description                            | Parameters                                     |
|----------------------------------|--------|----------------------------------------|------------------------------------------------|
| `/api/import-data`               | POST   | Import data from CSV                   | None                                           |
| `/api/top-products`              | GET    | Fetch top products                     | `startDate`, `endDate`, `groupBy`, `limit`     |

---
