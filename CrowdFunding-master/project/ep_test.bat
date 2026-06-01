@echo off
setlocal enabledelayedexpansion
set BASE=http://localhost:5000

echo === STEP 1: Login and get token ===
curl -s -X POST %BASE%/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"ep99@test.com\",\"password\":\"Test@1234\"}" --max-time 5 > login.json
type login.json
echo.

echo === STEP 2: Extract token using PowerShell ===
for /f "delims=" %%i in ('powershell -ExecutionPolicy Bypass -Command "(Get-Content login.json | ConvertFrom-Json).token"') do set TOKEN=%%i
echo TOKEN=%TOKEN:~0,40%...
echo.

echo === AUTH ENDPOINTS ===
curl -s -o NUL -w "GET  /api/auth/profile             -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/auth/profile --max-time 5
curl -s -o NUL -w "PUT  /api/auth/profile             -> %%{http_code}\n" -X PUT -H "Authorization: Bearer !TOKEN!" -H "Content-Type: application/json" -d "{\"name\":\"Updated\"}" %BASE%/api/auth/profile --max-time 5

echo === PROJECT ENDPOINTS ===
curl -s -o NUL -w "GET  /api/projects (public)        -> %%{http_code}\n" %BASE%/api/projects --max-time 5
curl -s -o NUL -w "GET  /api/projects/1               -> %%{http_code}\n" %BASE%/api/projects/1 --max-time 5
curl -s -o NUL -w "GET  /api/projects/user/projects   -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/projects/user/projects --max-time 5

echo === COMPANY ENDPOINTS ===
curl -s -o NUL -w "GET  /api/companies (public)       -> %%{http_code}\n" %BASE%/api/companies --max-time 5
curl -s -o NUL -w "GET  /api/companies/1              -> %%{http_code}\n" %BASE%/api/companies/1 --max-time 5

echo === REVIEW ENDPOINTS ===
curl -s -o NUL -w "GET  /api/reviews/company/1        -> %%{http_code}\n" %BASE%/api/reviews/company/1 --max-time 5
curl -s -o NUL -w "POST /api/reviews                  -> %%{http_code}\n" -X POST -H "Authorization: Bearer !TOKEN!" -H "Content-Type: application/json" -d "{\"companyId\":1,\"rating\":5,\"comment\":\"Good\"}" %BASE%/api/reviews --max-time 5

echo === INVESTMENT ENDPOINTS ===
curl -s -o NUL -w "GET  /api/investments/user         -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/investments/user --max-time 5
curl -s -o NUL -w "GET  /api/investments/project/1   -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/investments/project/1 --max-time 5

echo === DOCUMENT ENDPOINTS ===
curl -s -o NUL -w "GET  /api/documents               -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/documents --max-time 5

echo === COMPLAINT ENDPOINTS ===
curl -s -o NUL -w "GET  /api/complaints/user         -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/complaints/user --max-time 5
curl -s -o NUL -w "POST /api/complaints              -> %%{http_code}\n" -X POST -H "Authorization: Bearer !TOKEN!" -H "Content-Type: application/json" -d "{\"subject\":\"Test\",\"description\":\"Testing\",\"projectId\":1}" %BASE%/api/complaints --max-time 5

echo === ADMIN ENDPOINTS (expect 403 - user role) ===
curl -s -o NUL -w "GET  /api/admin/stats             -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/admin/stats --max-time 5
curl -s -o NUL -w "GET  /api/admin/users             -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/admin/users --max-time 5
curl -s -o NUL -w "GET  /api/admin/projects          -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/admin/projects --max-time 5
curl -s -o NUL -w "GET  /api/admin/complaints        -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/admin/complaints --max-time 5

echo === MESSAGE ENDPOINTS ===
curl -s -o NUL -w "GET  /api/messages/1              -> %%{http_code}\n" -H "Authorization: Bearer !TOKEN!" %BASE%/api/messages/1 --max-time 5
curl -s -o NUL -w "POST /api/messages                -> %%{http_code}\n" -X POST -H "Authorization: Bearer !TOKEN!" -H "Content-Type: application/json" -d "{\"receiverId\":1,\"content\":\"Hello\"}" %BASE%/api/messages --max-time 5

echo === PAYMENT ENDPOINTS ===
curl -s -o NUL -w "POST /api/payment/order           -> %%{http_code}\n" -X POST -H "Authorization: Bearer !TOKEN!" -H "Content-Type: application/json" -d "{\"amount\":100,\"projectId\":1}" %BASE%/api/payment/order --max-time 5

echo.
echo === DONE ===
endlocal
