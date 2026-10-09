param(
  [string]$src = "C:\Users\Lenovo\OneDrive\Desktop\GDG BOUNTY\sanad\SANAD_ISDIA_2027_Revised.docx",
  [string]$dst = "C:\Users\Lenovo\OneDrive\Desktop\GDG BOUNTY\sanad\paper\SANAD_ISDIA_2027_Revised.pdf"
)
$ErrorActionPreference = "Stop"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($src, $false, $true)
$pages = $doc.ComputeStatistics(2)   # pre-layout estimate; authoritative count = pypdf on $dst
$doc.ExportAsFixedFormat($dst, 17)
$doc.Close($false)
$word.Quit()
Write-Output "PAGES=$pages"
