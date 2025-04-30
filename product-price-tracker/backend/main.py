from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import os
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to CSV files
CSV_FILE = "produtos.csv"
VENDAS_CSV_FILE = "vendas.csv"

# Flags to track if values are locked
IS_LOCKED = False
IS_VENDAS_LOCKED = False
TOTAL_SUM = 0
TOTAL_VENDAS_SUM = 0

# Initialize CSV files if they don't exist
def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["nome", "preco"])
            
    if not os.path.exists(VENDAS_CSV_FILE):
        with open(VENDAS_CSV_FILE, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["nome", "preco"])

# Read products from CSV
def read_products():
    if not os.path.exists(CSV_FILE):
        init_csv()
        return []
    
    products = []
    with open(CSV_FILE, 'r', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Skip the Total row if present
            if row.get("nome", "") == "Total:":
                continue
                
            # Skip empty rows
            if not row.get("nome", "").strip():
                continue
                
            products.append({
                "id": len(products) + 1,  # Generate ID on the fly
                "name": row["nome"] if "nome" in row else row.get("name", ""),
                "price": float(row["preco"] if "preco" in row else row.get("price", 0)),
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Generate timestamp on the fly
            })
    return products

# Read final value status
def read_final_value():
    global IS_LOCKED, TOTAL_SUM
    products = read_products()
    total_sum = sum(p["price"] for p in products) if products else 0
    
    # Update the global total sum
    TOTAL_SUM = total_sum
    
    return {
        "is_locked": IS_LOCKED,
        "total_sum": total_sum,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Read vendas from CSV
def read_vendas():
    if not os.path.exists(VENDAS_CSV_FILE):
        init_csv()
        return []
    
    vendas = []
    with open(VENDAS_CSV_FILE, 'r', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Skip the Total row if present
            if row.get("nome", "") == "Total:":
                continue
                
            # Skip empty rows
            if not row.get("nome", "").strip():
                continue
                
            vendas.append({
                "id": len(vendas) + 1,  # Generate ID on the fly
                "name": row["nome"] if "nome" in row else row.get("name", ""),
                "price": float(row["preco"] if "preco" in row else row.get("price", 0)),
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Generate timestamp on the fly
            })
    return vendas

# Read vendas final value status
def read_vendas_final_value():
    global IS_VENDAS_LOCKED, TOTAL_VENDAS_SUM
    vendas = read_vendas()
    total_sum = sum(v["price"] for v in vendas) if vendas else 0
    
    # Update the global total sum
    TOTAL_VENDAS_SUM = total_sum
    
    return {
        "is_locked": IS_VENDAS_LOCKED,
        "total_sum": total_sum,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Write products to CSV
def write_products(products):
    with open(CSV_FILE, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["nome", "preco"])
        writer.writeheader()
        for product in products:
            writer.writerow({
                "nome": product["name"],
                "preco": product["price"]
            })

# Write vendas to CSV
def write_vendas(vendas):
    with open(VENDAS_CSV_FILE, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["nome", "preco"])
        writer.writeheader()
        for venda in vendas:
            writer.writerow({
                "nome": venda["name"],
                "preco": venda["price"]
            })

# Write final value status
def write_final_value(final_value):
    global IS_LOCKED
    
    # Update the global lock status
    IS_LOCKED = final_value["is_locked"]
    
    # When locked, add the final value to the products CSV
    if final_value["is_locked"]:
        # Add a row with the final value to the products CSV
        products = read_products()
        with open(CSV_FILE, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["nome", "preco"])
            writer.writeheader()
            
            # Write all existing products
            for product in products:
                writer.writerow({
                    "nome": product["name"],
                    "preco": product["price"]
                })
            
            # Add the "Total:" row with the sum
            writer.writerow({
                "nome": "Total:",
                "preco": final_value["total_sum"]
            })

# Write vendas final value status
def write_vendas_final_value(final_value):
    global IS_VENDAS_LOCKED
    
    # Update the global lock status
    IS_VENDAS_LOCKED = final_value["is_locked"]
    
    # When locked, add the final value to the vendas CSV
    if final_value["is_locked"]:
        # Add a row with the final value to the vendas CSV
        vendas = read_vendas()
        with open(VENDAS_CSV_FILE, 'w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=["nome", "preco"])
            writer.writeheader()
            
            # Write all existing vendas
            for venda in vendas:
                writer.writerow({
                    "nome": venda["name"],
                    "preco": venda["price"]
                })
            
            # Add the "Total:" row with the sum
            writer.writerow({
                "nome": "Total:",
                "preco": final_value["total_sum"]
            })

# Models
class Product(BaseModel):
    name: str
    price: float

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    timestamp: str

class Venda(BaseModel):
    name: str
    price: float

class VendaResponse(BaseModel):
    id: int
    name: str
    price: float
    timestamp: str

class FinalValueResponse(BaseModel):
    is_locked: bool
    total_sum: float
    timestamp: str

@app.on_event("startup")
async def startup_event():
    init_csv()

@app.get("/products", response_model=List[ProductResponse])
async def get_products():
    try:
        products = read_products()
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao recuperar produtos: {str(e)}")

@app.get("/vendas", response_model=List[VendaResponse])
async def get_vendas():
    try:
        vendas = read_vendas()
        return vendas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao recuperar vendas: {str(e)}")

@app.post("/products", response_model=ProductResponse)
async def add_product(product: Product):
    try:
        # Check if final value is locked
        final_value = read_final_value()
        if final_value["is_locked"]:
            raise HTTPException(status_code=400, detail="Valor final já está bloqueado. Não é possível adicionar novos produtos.")
        
        products = read_products()
        
        # Generate new ID
        new_id = 1
        if products:
            new_id = max(p["id"] for p in products) + 1
            
        # Add new product
        new_product = {
            "id": new_id,
            "name": product.name,
            "price": product.price,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        products.append(new_product)
        write_products(products)
        
        return new_product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao adicionar produto: {str(e)}")

@app.post("/vendas", response_model=VendaResponse)
async def add_venda(venda: Venda):
    try:
        # Check if final value is locked
        final_value = read_vendas_final_value()
        if final_value["is_locked"]:
            raise HTTPException(status_code=400, detail="Valor final já está bloqueado. Não é possível adicionar novas vendas.")
        
        vendas = read_vendas()
        
        # Generate new ID
        new_id = 1
        if vendas:
            new_id = max(v["id"] for v in vendas) + 1
            
        # Add new venda
        new_venda = {
            "id": new_id,
            "name": venda.name,
            "price": venda.price,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        vendas.append(new_venda)
        write_vendas(vendas)
        
        return new_venda
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao adicionar venda: {str(e)}")

@app.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: Product):
    try:
        # Check if final value is locked
        final_value = read_final_value()
        if final_value["is_locked"]:
            raise HTTPException(status_code=400, detail="Valor final já está bloqueado. Não é possível atualizar produtos.")
        
        products = read_products()
        
        # Find product by ID
        product_index = next((i for i, p in enumerate(products) if p["id"] == product_id), None)
        if product_index is None:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        # Update product
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        products[product_index] = {
            "id": product_id,
            "name": product.name,
            "price": product.price,
            "timestamp": timestamp
        }
        
        write_products(products)
        
        return products[product_index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar produto: {str(e)}")

@app.put("/vendas/{venda_id}", response_model=VendaResponse)
async def update_venda(venda_id: int, venda: Venda):
    try:
        # Check if final value is locked
        final_value = read_vendas_final_value()
        if final_value["is_locked"]:
            raise HTTPException(status_code=400, detail="Valor final já está bloqueado. Não é possível atualizar vendas.")
        
        vendas = read_vendas()
        
        # Find venda by ID
        venda_index = next((i for i, v in enumerate(vendas) if v["id"] == venda_id), None)
        if venda_index is None:
            raise HTTPException(status_code=404, detail="Venda não encontrada")
        
        # Update venda
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        vendas[venda_index] = {
            "id": venda_id,
            "name": venda.name,
            "price": venda.price,
            "timestamp": timestamp
        }
        
        write_vendas(vendas)
        
        return vendas[venda_index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar venda: {str(e)}")

@app.get("/final-value", response_model=FinalValueResponse)
async def get_final_value():
    try:
        final_value = read_final_value()
        return final_value
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving final value: {str(e)}")

@app.get("/vendas-final-value", response_model=FinalValueResponse)
async def get_vendas_final_value():
    try:
        final_value = read_vendas_final_value()
        return final_value
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao recuperar valor final das vendas: {str(e)}")

@app.put("/final-value/lock", response_model=FinalValueResponse)
async def lock_final_value():
    try:
        products = read_products()
        
        if not products:
            raise HTTPException(status_code=400, detail="Não há produtos para calcular o valor final.")
        
        # Calculate total sum
        total_sum = sum(p["price"] for p in products)
        
        # Create final value object
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        final_value = {
            "is_locked": True,
            "total_sum": total_sum,
            "timestamp": timestamp
        }
        
        write_final_value(final_value)
        
        return final_value
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao bloquear valor final: {str(e)}")

@app.put("/vendas-final-value/lock", response_model=FinalValueResponse)
async def lock_vendas_final_value():
    try:
        vendas = read_vendas()
        
        if not vendas:
            raise HTTPException(status_code=400, detail="Não há vendas para calcular o valor final.")
        
        # Calculate total sum
        total_sum = sum(v["price"] for v in vendas)
        
        # Create final value object
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        final_value = {
            "is_locked": True,
            "total_sum": total_sum,
            "timestamp": timestamp
        }
        
        write_vendas_final_value(final_value)
        
        return final_value
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao bloquear valor final das vendas: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
