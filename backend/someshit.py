import os
import re
import mysql.connector

# Connect to the MySQL database
def connect_to_database():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="RandE1994!",
        database="inclusiveaid"
    )

# Execute a database query
def execute_query(query, params=None):
    db = connect_to_database()
    cursor = db.cursor()
    cursor.execute(query, params)
    result = cursor.fetchall()
    db.close()
    return result

# Get all tables in the database
def get_database_tables():
    query = "SHOW TABLES"
    tables = execute_query(query)
    return [table[0] for table in tables]

# Generate controller code based on backend routes and selected tables
def generate_controllers(selected_tables):
    # Get all backend route files
    backend_routes_dir = "inclusive-aid/backend/src/routes"
    route_files = [f for f in os.listdir(backend_routes_dir) if f.endswith(".js")]

    # Generate controller code for each route
    for route_file in route_files:
        with open(os.path.join(backend_routes_dir, route_file), "r") as file:
            route_code = file.read()

            # Extract route paths and HTTP methods using regular expressions
            route_paths = re.findall(r"router\.(get|post|put|delete)\(['\"](.*?)['\"]", route_code)

            # Generate controller functions for each route path
            for http_method, route_path in route_paths:
                # Convert route path to function name
                function_name = route_path.replace("/", "_").replace(":", "").replace("-", "_")

                # Generate controller function code
                controller_code = f"""
exports.{function_name} = async (req, res) => {{
    try {{
        // Retrieve data from the database based on the route path
        const query = "SELECT * FROM table_name WHERE condition";
        const params = [];
        const result = await execute_query(query, params);

        // Process the retrieved data and send the response
        res.status(200).json({{ data: result }});
    }} catch (error) {{
        console.error('Error in {function_name}:', error);
        res.status(500).json({{ message: 'Internal Server Error' }});
    }}
}};
"""

                # Save the controller code to a file
                controller_file = f"inclusive-aid/backend/src/controllers/{function_name}Controller.js"
                with open(controller_file, "w") as file:
                    file.write(controller_code)

    print("Controllers generated successfully.")

# Run the script
if __name__ == "__main__":
    # Get all tables in the database
    tables = get_database_tables()

    # Prompt the user to select tables for controller generation
    print("Available tables:")
    for i, table in enumerate(tables, start=1):
        print(f"{i}. {table}")

    selected_tables = input("Enter the numbers of the tables for which you want to generate controllers (comma-separated): ")
    selected_table_indices = [int(index.strip()) - 1 for index in selected_tables.split(",")]
    selected_tables = [tables[index] for index in selected_table_indices]

    # Generate controllers for the selected tables
    generate_controllers(selected_tables)
