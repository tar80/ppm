'!*script
'
' Get entries count in specified directory
'
' @version 1.0
' @return {number} Entries count
' @arg {string} 0 Specify directory path
' @arg {string} 1 Specify Target attribute. both(default) | dir | file
' @arg {number} 2 Specify the limit of count

Option Explicit

Dim scriptName, aryParam, strDirspec, strAtt, numLimit
scriptName = PPx.ScriptName
aryParam = args_to_array(PPx.Arguments)
strDirspec = aryParam(0)
strAtt = aryParam(1)
numLimit = aryParam(2)

Dim fso, objDir, directory, file, entryCount, i
Set fso = PPx.CreateObject("Scripting.FileSystemObject")

Sub Counter(path)
  If TypeName(numLimit) <> "Empty" And numLimit <= entryCount Then
    Exit Sub
  End If

  Set objDir = fso.GetFolder(path)

  If strAtt <> "file" Then
    entryCount = entryCount + CInt(objDir.SubFolders.Count)
  End If

  If strAtt <> "dir" Then
    entryCount = entryCount + CInt(objDir.Files.Count)
  End If

  For Each directory In objDir.SubFolders
    Counter(directory)
  Next
End Sub

Counter(strDirspec)

PPx.Result = entryCount

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
  If l > 2 Then p = CInt(args.Item(2))

  args_to_array = Array(d, a, p)
End Function

