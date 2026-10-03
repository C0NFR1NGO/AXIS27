import os
import os
from dotenv import load_dotenv

# Load environment variables FIRST before importing or running backend logic
load_dotenv()
import json
import gspread
import random
from datetime import datetime
from google.oauth2.service_account import Credentials

def get_sheet_connection(sheet_name="Sheet1"):
    try:
        creds_raw = os.environ.get("GOOGLE_CREDENTIALS_JSON")
        if not creds_raw:
            raise ValueError("GOOGLE_CREDENTIALS_JSON environment variable missing.")
            
        creds_dict = json.loads(creds_raw)
        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        creds = Credentials.from_service_account_info(creds_dict, scopes=scopes)
        client = gspread.authorize(creds)
        
        workspace_id = os.environ.get("GOOGLE_WORKSPACE_ID")
        if not workspace_id:
            raise ValueError("GOOGLE_WORKSPACE_ID environment variable missing.")
        
        spreadsheet = client.open_by_key(workspace_id)
        return spreadsheet.worksheet(sheet_name)
    except Exception as e:
        print(f"Error connecting to Google Sheet: {e}")
        raise e

def add_registration_to_sheet(form_data: dict, sheet_name="Sheet1"):
    try:
        sheet = get_sheet_connection(sheet_name)
        
        reg_id = f"JSO-{random.randint(1000, 9999)}"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        row_data = [
            timestamp,
            reg_id,
            form_data.get("full_name", ""),
            form_data.get("school", ""),
            form_data.get("student_class", ""),
            form_data.get("email", ""),
            form_data.get("phone", ""),
            form_data.get("alt_phone", ""),
            form_data.get("city", "")
          
        ]
        
        # Append row specifying table range to guarantee column A start
        sheet.append_row(row_data, table_range="A1")
        return {"success": True, "registration_id": reg_id}
    except Exception as e:
        print(f"Error appending row: {e}")
        return {"success": False, "error": str(e)}