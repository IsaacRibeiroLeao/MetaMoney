# Product Price Tracker

A simple React application with FastAPI backend that allows users to track product prices, add them to an Excel sheet, and lock final values.

## Project Structure

- `frontend/`: React application built with TypeScript and Material UI
- `backend/`: FastAPI backend that handles Excel operations

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

## Usage

1. Start both the backend and frontend servers.
2. Open your browser and navigate to `http://localhost:3000`.
3. Use the form to add new products with their prices.
4. Products will be automatically saved to an Excel file on the backend.
5. You can edit products as needed until you're satisfied with the values.
6. Lock a product when you're satisfied with its final value.

## Features

- Real-time product tracking
- Excel sheet generation and management
- Ability to lock final values
- Modern UI with Material Design
- Full-stack application with React and FastAPI

## API Endpoints

- `GET /products`: Retrieve all products
- `POST /products`: Add a new product
- `PUT /products/{product_id}`: Update a product
- `PUT /products/{product_id}/lock`: Lock a product's final value
