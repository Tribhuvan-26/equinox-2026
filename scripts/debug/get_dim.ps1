Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "public/assets/events/ecell/ecell-master.png").Path)
Write-Output "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
