from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sheet_google import add_registration_to_sheet

app = FastAPI()

# Enable CORS so your frontend can communicate with FastAPI without browser blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from http://127.0.0.1:5501
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/Dx/register")
async def register(
    full_name: str = Form(...),
    school: str = Form(...),
    student_class: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    alt_phone: str = Form(""),
    city: str = Form(...),
    payment_screenshot_url: str = Form("")
):
    data = {
        "full_name": full_name,
        "school": school,
        "student_class": student_class,
        "email": email,
        "phone": phone,
        "alt_phone": alt_phone,
        "city": city
        
    }
    
    res = add_registration_to_sheet(data)
    
    if res["success"]:
        return JSONResponse(
            content={
                "status": "success",
                "registration_id": res["registration_id"],
                "message": "Registration successful!"
            }, 
            status_code=200
        )
    else:
        return JSONResponse(
            content={
                "status": "error",
                "detail": res["error"]
            }, 
            status_code=500
        )