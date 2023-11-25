'!*script
'
' Get entries in specified directory
'
' @version 1.0
' @return {string} Comma sepalated entry list
' @arg {string} 0 Specify directory path
' @arg {string} 1 Specify target attribute. both(default) | dir | file
' @arg {number} 2 Specify the entry-name to extract(ignorecase)

Option Explicit

Dim scriptName, aryParam, strDirspec, strAtt, strPattern
scriptName = PPx.ScriptName
aryParam = args_to_array(PPx.Arguments)
strDirspec = aryParam(0)
strAtt = aryParam(1)
strPattern = aryParam(2)

Dim fso, objDir, directory, file, aryEntries(), i
Set fso = PPx.CreateObject("Scripting.FileSystemObject")
Set objDir = fso.GetFolder(strDirspec)
i = 0

If strAtt <> "file" Then
  For Each directory In objDir.SubFolders
    If InStr(1, directory.Name, strPattern, 1) > 0 Then
      ReDim PreServe aryEntries(i)
      aryEntries(i) = directory.Name
      i = i + 1
    End If
  Next
End If

If strAtt <> "dir" Then
  For Each file In objDir.Files
    If InStr(1, file.Name, strPattern, 1) > 0 Then
      ReDim PreServe aryEntries(i)
      aryEntries(i) = file.Name
      i = i + 1
    End If
  Next
End If

PPx.Result = Join(aryEntries)

Function args_to_array(args)
  Dim l, d, a, p
  l = args.length
  a = "both"

  If l < 1 Then
    PPx.Echo(scriptName & ": Not enough arguments.")
    PPx.Quit(1)
  End If

  d = args.Item(0)

  If l > 1 then a = LCase(args.Item(1))
  If l > 2 Then p = args.Item(2)

  args_to_array = Array(d, a, p)
End Function

