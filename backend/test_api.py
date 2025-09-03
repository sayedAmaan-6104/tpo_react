#!/usr/bin/env python3
"""
Test script for TPO Backend API
Run this to test the authentication endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def test_student_registration():
    """Test student registration"""
    print("Testing Student Registration...")
    url = f"{BASE_URL}/register/student/"
    data = {
        "username": "test_student",
        "email": "student@test.com",
        "first_name": "Test",
        "last_name": "Student",
        "password": "testpass123",
        "password_confirm": "testpass123",
        "student_id": "TEST001",
        "university": "Test University",
        "course": "Computer Science",
        "year_of_study": 3,
        "phone_number": "+1234567890"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_recruiter_registration():
    """Test recruiter registration"""
    print("\nTesting Recruiter Registration...")
    url = f"{BASE_URL}/register/recruiter/"
    data = {
        "username": "test_recruiter",
        "email": "recruiter@test.com",
        "first_name": "Test",
        "last_name": "Recruiter",
        "password": "testpass123",
        "password_confirm": "testpass123",
        "company_name": "Test Company",
        "company_website": "https://testcompany.com",
        "position": "HR Manager",
        "phone_number": "+1234567890",
        "industry": "Technology"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_login(email, password, user_type):
    """Test login"""
    print(f"\nTesting {user_type.title()} Login...")
    url = f"{BASE_URL}/login/"
    data = {
        "email": email,
        "password": password,
        "user_type": user_type
    }
    
    try:
        session = requests.Session()
        response = session.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            return session
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_profile(session):
    """Test profile endpoint"""
    print("\nTesting Profile Endpoint...")
    url = f"{BASE_URL}/profile/"
    
    try:
        response = session.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_logout(session):
    """Test logout"""
    print("\nTesting Logout...")
    url = f"{BASE_URL}/logout/"
    
    try:
        response = session.post(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Main test function"""
    print("=== TPO Backend API Test ===\n")
    
    # Test registrations
    student_reg = test_student_registration()
    recruiter_reg = test_recruiter_registration()
    
    if student_reg:
        # Test student login
        student_session = test_login("student@test.com", "testpass123", "student")
        if student_session:
            test_profile(student_session)
            test_logout(student_session)
    
    if recruiter_reg:
        # Test recruiter login
        recruiter_session = test_login("recruiter@test.com", "testpass123", "recruiter")
        if recruiter_session:
            test_profile(recruiter_session)
            test_logout(recruiter_session)
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    main()
