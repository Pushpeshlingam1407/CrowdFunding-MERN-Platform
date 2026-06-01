$base = 'http://localhost:5000'
$results = [System.Collections.ArrayList]@()

function T {
    param([string]$m, [string]$u, [string]$b, [string]$tok, [string]$lbl)
    try {
        $h = @{ 'Content-Type' = 'application/json' }
        if ($tok) { $h['Authorization'] = "Bearer $tok" }
        $p = @{ Uri = $u; Method = $m; Headers = $h; TimeoutSec = 4; ErrorAction = 'Stop' }
        if ($b) { $p['Body'] = $b }
        $r = Invoke-WebRequest @p
        $null = $results.Add([PSCustomObject]@{ Code = $r.StatusCode; Label = $lbl; Note = 'OK' })
    }
    catch {
        $code = $_.Exception.Response.StatusCode.value__
        $note = switch ($code) {
            400 { 'BAD_REQ - alive' }; 401 { 'UNAUTH - needs token' }
            403 { 'FORBIDDEN - needs role' }; 404 { 'NOT FOUND' }
            default { "ERR $code" }
        }
        $null = $results.Add([PSCustomObject]@{ Code = $code; Label = $lbl; Note = $note })
    }
}

# ── Register ──────────────────────────────────────────────────────────────────
T 'POST' "$base/api/auth/register" '{"name":"Tester","email":"ep_tester@x.com","password":"Test@1234","role":"user"}' '' 'POST /api/auth/register'

# ── Login ─────────────────────────────────────────────────────────────────────
$tok = ''
try {
    $lr = Invoke-WebRequest -Uri "$base/api/auth/login" -Method POST `
        -Headers @{ 'Content-Type' = 'application/json' } `
        -Body '{"email":"ep_tester@x.com","password":"Test@1234"}' -TimeoutSec 4 -ErrorAction Stop
    $tok = ($lr.Content | ConvertFrom-Json).token
    $preview = if ($tok) { $tok.Substring(0, [Math]::Min(20, $tok.Length)) + '...' } else { 'null' }
    $null = $results.Add([PSCustomObject]@{ Code = 200; Label = 'POST /api/auth/login'; Note = "TOKEN: $preview" })
}
catch {
    $null = $results.Add([PSCustomObject]@{ Code = $_.Exception.Response.StatusCode.value__; Label = 'POST /api/auth/login'; Note = 'LOGIN FAILED' })
}

# ── Auth ──────────────────────────────────────────────────────────────────────
T 'GET' "$base/api/auth/profile" '' $tok 'GET  /api/auth/profile'
T 'GET' "$base/api/auth/me"      '' $tok 'GET  /api/auth/me'

# ── Projects ──────────────────────────────────────────────────────────────────
T 'GET' "$base/api/projects"               '' ''   'GET  /api/projects (public)'
T 'GET' "$base/api/projects/1"             '' ''   'GET  /api/projects/:id'
T 'GET' "$base/api/projects/user/projects" '' $tok 'GET  /api/projects/user/projects'

# ── Companies ─────────────────────────────────────────────────────────────────
T 'GET' "$base/api/companies"   '' '' 'GET  /api/companies (public)'
T 'GET' "$base/api/companies/1" '' '' 'GET  /api/companies/:id'

# ── Reviews ───────────────────────────────────────────────────────────────────
T 'GET'  "$base/api/reviews/company/1" '' ''   'GET  /api/reviews/company/:id'
T 'POST' "$base/api/reviews" '{"companyId":1,"rating":5,"comment":"Good"}' $tok 'POST /api/reviews'

# ── Investments ───────────────────────────────────────────────────────────────
T 'GET' "$base/api/investments/user"         '' $tok 'GET  /api/investments/user'
T 'GET' "$base/api/investments/project/1"    '' $tok 'GET  /api/investments/project/:id'

# ── Documents ─────────────────────────────────────────────────────────────────
T 'GET' "$base/api/documents" '' $tok 'GET  /api/documents'

# ── Complaints ────────────────────────────────────────────────────────────────
T 'GET'  "$base/api/complaints/user" ''  $tok 'GET  /api/complaints/user'
T 'POST' "$base/api/complaints" '{"subject":"Test","description":"Test desc","projectId":1}' $tok 'POST /api/complaints'

# ── Admin (expect 403 with user token) ───────────────────────────────────────
T 'GET' "$base/api/admin/stats"      '' $tok 'GET  /api/admin/stats'
T 'GET' "$base/api/admin/users"      '' $tok 'GET  /api/admin/users'
T 'GET' "$base/api/admin/projects"   '' $tok 'GET  /api/admin/projects'
T 'GET' "$base/api/admin/complaints" '' $tok 'GET  /api/admin/complaints'

# ── Messages ──────────────────────────────────────────────────────────────────
T 'GET'  "$base/api/messages/1" ''  $tok 'GET  /api/messages/:id'
T 'POST' "$base/api/messages" '{"receiverId":1,"content":"Hello"}' $tok 'POST /api/messages'

# ── Payment ───────────────────────────────────────────────────────────────────
T 'POST' "$base/api/payment/order" '{"amount":100,"projectId":1}' $tok 'POST /api/payment/order'

# ── Print Results ─────────────────────────────────────────────────────────────
Write-Host "`n===== ENDPOINT TEST RESULTS =====" -ForegroundColor Cyan
foreach ($r in $results) {
    $col = if ($r.Code -in 200,201) { 'Green' } elseif ($r.Code -in 400,401,403) { 'Yellow' } else { 'Red' }
    Write-Host ("[{0,3}]  {1,-42} {2}" -f $r.Code, $r.Label, $r.Note) -ForegroundColor $col
}
$pass  = ($results | Where-Object { $_.Code -in 200,201,400,401,403 }).Count
$fail  = ($results | Where-Object { $_.Code -notin 200,201,400,401,403 }).Count
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  WORKING: $pass/$($results.Count)   ISSUES: $fail" -ForegroundColor White
