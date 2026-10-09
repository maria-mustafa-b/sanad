$ErrorActionPreference = "Stop"
$src = "C:\Users\Lenovo\OneDrive\Desktop\GDG BOUNTY\sanad\SANAD_ISDIA_2027_Revised.docx"
$dst = "C:\Users\Lenovo\OneDrive\Desktop\GDG BOUNTY\sanad\paper\SANAD_ISDIA_2027_Revised.pdf"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($src, $false, $true)
$pages = $doc.ComputeStatistics(2)
$doc.ExportAsFixedFormat($dst, 17)
$doc.Close($false)
$word.Quit()
Write-Output "PAGES=$pages"
