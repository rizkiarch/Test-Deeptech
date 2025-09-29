# Transaction API Documentation

## Endpoints

### 1. Get All Transactions
- **GET** `/api/transactions`
- **Response**: List of all transactions with product names

### 2. Get Transaction by ID
- **GET** `/api/transactions/:id`
- **Response**: Single transaction details

### 3. Create Single Transaction
- **POST** `/api/transactions`
- **Body**:
```json
{
  "type": "stock_in", // or "stock_out"
  "product_id": 1,
  "quantity": 10,
  "notes": "Initial stock"
}
```

### 4. Create Bulk Transactions
- **POST** `/api/transactions/bulk`
- **Body**:
```json
[
  {
    "type": "stock_in",
    "product_id": 1,
    "quantity": 50,
    "notes": "Initial stock product 1"
  },
  {
    "type": "stock_in",
    "product_id": 2,
    "quantity": 30,
    "notes": "Initial stock product 2"
  },
  {
    "type": "stock_out",
    "product_id": 1,
    "quantity": 5,
    "notes": "Sale order #001"
  }
]
```

### 5. Update Single Transaction
- **PUT** `/api/transactions/:id`
- **Body**:
```json
{
  "quantity": 15,
  "notes": "Updated quantity"
}
```

### 6. Update Bulk Transactions
- **PUT** `/api/transactions/bulk`
- **Body**:
```json
[
  {
    "id": 1,
    "quantity": 20,
    "notes": "Updated bulk transaction 1"
  },
  {
    "id": 2,
    "notes": "Updated notes only"
  }
]
```

### 7. Delete Transaction
- **DELETE** `/api/transactions/:id`

### 8. Get Transactions by Product ID
- **GET** `/api/transactions/product/:productId`
- **Response**: List of transactions for specific product

## Features

1. **Stock Management**: Automatically updates product stock when creating transactions
2. **Validation**: 
   - Ensures stock_out doesn't exceed available stock
   - Validates transaction types (stock_in/stock_out)
   - Checks product existence
3. **Bulk Operations**: Process multiple transactions in single request
4. **Error Handling**: Detailed error messages with validation results
5. **Multi-Product Support**: Single transaction request can involve multiple products

## Transaction Types

- **stock_in**: Increases product stock (purchase, return, etc.)
- **stock_out**: Decreases product stock (sale, damage, etc.)

## Bulk Transaction Response

```json
{
  "status": "success",
  "data": {
    "successful": [
      {
        "index": 0,
        "id": 1,
        "product_id": 1,
        "type": "stock_in",
        "quantity": 50
      }
    ],
    "failed": [
      {
        "index": 2,
        "message": "Insufficient stock"
      }
    ],
    "totalProcessed": 3,
    "successCount": 2,
    "errorCount": 1
  },
  "message": "Bulk transactions processed: 2 successful, 1 failed"
}
```