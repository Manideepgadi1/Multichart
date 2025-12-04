"""
Script to copy the CSV file to workspace and analyze the data structure
"""
import shutil
import csv
from pathlib import Path

# Source and destination paths
source_file = r"c:\Users\manid\Downloads\Latest_Indices_rawdata_14112025.csv"
dest_file = r"d:\Multichart\Latest_Indices_rawdata_14112025.csv"

# Copy the file
try:
    shutil.copy2(source_file, dest_file)
    print(f"✓ File copied successfully to: {dest_file}")
    print()
    
    # Read and display structure
    with open(dest_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        print("CSV Structure:")
        print(f"Columns found: {len(headers)}")
        print(f"Column names: {', '.join(headers)}")
        print()
        
        # Show first few rows
        print("First 5 rows of data:")
        print("-" * 80)
        for i, row in enumerate(reader):
            if i < 5:
                print(row)
            else:
                break
        
        print("-" * 80)
        print(f"\n✓ Data is ready to use!")
        
except FileNotFoundError:
    print(f"Error: Source file not found at {source_file}")
except Exception as e:
    print(f"Error: {e}")
