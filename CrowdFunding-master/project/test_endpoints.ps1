$base = 'http://localhost:5000'
$results = @()

function Invoke-Endpoint {
    param($method, $url, $body, $token, $label)
    try {
        $headers = @{ 'Content-Type' = 'application/json' }
        if ($token) { $headers['Authorization'] = "Bearer $token" }
        $params = @{ Uri = $url; Method = $method; Headers = $headers; TimeoutSec = 5; ErrorAction = 'Stop' }
        if ($body) { $params['Body'] = ($body | ConvertTo-Json -Compress) }
        $r = Invoke-WebRequest @params
        return [PSCustomObject]@{ Endpoint = $label; HTTP = $r.StatusCode; Result = 'OK' }
    }
    catch {
        $code = $_.Exception.Response.StatusCode.value__
        $msg = switch ($code) {
            400 { 'BAD_REQUEST (OK - endpoint alive)' }
            401 { 'UNAUTHORIZED (OK - needs token)' }
            403 { 'FORBIDDEN (OK - needs role)' }
            404 { 'NOT_FOUND' }
            default { "ERROR $code" }
        }
        return [PSCustomObject]@{ Endpoint = $label; HTTP = $code; Result = $msg }
    }
}

# --- STEP 1: Register ---
$results += Invoke-Endpoint 'POST' "$base/api/auth/register" @{name='APITester';email='apitester@test.com';password='Test@1234';role='user'} $null 'POST /api/auth/register'

# --- STEP 2: Login & get token ---
$token = ''
try {
    $lr = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST `
        -Headers @{'Content-Type'='application/json'} `
        -Body (@{email='apitester@test.com';password='Test@1234'} | ConvertTo-Json -Compress) `
        -TimeoutSec 5 -ErrorAction Stop
    $parsed = $lr.Content | ConvertFrom-Json
    $token = $parsed.token
    $results += [PSCustomObject]@{ Endpoint = 'POST /api/auth/login'; HTTP = 200; Result = "OK - Token: $($token.Substring(0,20))..." }
}
catch {
    $results += [PSCustomObject]@{ Endpoint = 'POST /api/auth/login'; HTTP = $_.Exception.Response.StatusCode.value__; Result = 'FAILED - cannot continue auth tests' }
}

# --- STEP 3: Auth endpoints ---
$results += Invoke-Endpoint 'GET' "$base/api/auth/profile" $null $token 'GET  /api/auth/profile'
$results += Invoke-Endpoint 'PUT' "$base/api/auth/profile" @{name='UpdatedName'} $token 'PUT  /api/auth/profile'

# --- STEP 4: Projects ---
$results += Invoke-Endpoint 'GET' "$base/api/projects" $null $null 'GET  /api/projects (public)'
$results += Invoke-Endpoint 'GET' "$base/api/projects/user/projects" $null $token 'GET  /api/projects/user/projects'
$results += Invoke-Endpoint 'GET' "$base/api/projects/1" $null $null 'GET  /api/projects/:id'

# --- STEP 5: Companies ---
$results += Invoke-Endpoint 'GET' "$base/api/companies" $null $null 'GET  /api/companies (public)'
$results += Invoke-Endpoint 'GET' "$base/api/companies/1" $null $null 'GET  /api/companies/:id'
$results += Invoke-Endpoint 'PUT' "$base/api/companies/1" @{name='Test Co'} $token 'PUT  /api/companies/:id'

# --- STEP 6: Reviews ---
$results += Invoke-Endpoint 'GET' "$base/api/reviews/company/1" $null $null 'GET  /api/reviews/company/:id'
$results += Invoke-Endpoint 'POST' "$base/api/reviews" @{companyId=1;rating=5;comment='Great'} $token 'POST /api/reviews'

# --- STEP 7: Investments ---
$results += Invoke-Endpoint 'GET' "$base/api/investments/user" $null $token 'GET  /api/investments/user'
$results += Invoke-Endpoint 'GET' "$base/api/investments/project/1" $null $token 'GET  /api/investments/project/:id'

# --- STEP 8: Documents ---
$results += Invoke-Endpoint 'GET' "$base/api/documents" $null $token 'GET  /api/documents'

# --- STEP 9: Complaints ---
$results += Invoke-Endpoint 'GET' "$base/api/complaints/user" $null $token 'GET  /api/complaints/user'
$results += Invoke-Endpoint 'POST' "$base/api/complaints" @{subject='Test';description='Test complaint';projectId=1} $token 'POST /api/complaints'

# --- STEP 10: Admin (expect 403 with regular user token) ---
$results += Invoke-Endpoint 'GET' "$base/api/admin/stats" $null $token 'GET  /api/admin/stats'
$results += Invoke-Endpoint 'GET' "$base/api/admin/users" $null $token 'GET  /api/admin/users'
$results += Invoke-Endpoint 'GET' "$base/api/admin/projects" $null $token 'GET  /api/admin/projects'
$results += Invoke-Endpoint 'GET' "$base/api/admin/complaints" $null $token 'GET  /api/admin/complaints'

# --- STEP 11: Messages ---
$results += Invoke-Endpoint 'GET' "$base/api/messages/1" $null $token 'GET  /api/messages/:id'
$results += Invoke-Endpoint 'POST' "$base/api/messages" @{receiverId=1;content='Hello'} $token 'POST /api/messages'

# --- Payment ---
$results += Invoke-Endpoint 'POST' "$base/api/payment/order" @{amount=100;projectId=1} $token 'POST /api/payment/order'

# --- Print results ---
Write-Host "`n=================== ENDPOINT TEST RESULTS ===================" -ForegroundColor Cyan
$results | ForEach-Object {
    $color = if ($_.HTTP -in 200,201) { 'Green' }
             elseif ($_.HTTP -in 400,401,403) { 'Yellow' }
             else { 'Red' }
    Write-Host ("[{0,3}] {1,-45} {2}" -f $_.HTTP, $_.Endpoint, $_.Result) -ForegroundColor $color
}
Write-Host "=============================================================" -ForegroundColor Cyan

$ok = ($results | Where-Object { $_.HTTP -in 200,201,400,401,403 }).Count
$fail = ($results | Where-Object { $_.HTTP -notin 200,201,400,401,403 }).Count
Write-Host "`n PASSED: $ok / $($results.Count)  |  ISSUES: $fail" -ForegroundColor White
