'!*script
'
' Get the entries in the specified directory
'
' @return {string} - Comma sepalated entries list
' @arg 0  {string} - Specify the target directory path
' @arg 1  {string} - Specify the target entry attributes. both(default) | dir | file
' @arg 2  {string} - Specify the entry name to extract
' @arg 3  {string} - If non-zero, search for files recursively up to the specified number of files

Option Explicit

Dim fso, aryArgs, aryEntries()
Set fso = PPx.CreateObject("Scripting.FileSystemObject")

Dim strDirspec, strAtt, strPattern, numRecursive
aryArgs = ArgsToArray(PPx.Arguments)
strDirspec = aryArgs(0)
strAtt = aryArgs(1)
strPattern = aryArgs(2)
numRecursive = CInt(aryArgs(3))
GetEntries("")
PPx.Result = Join(aryEntries, ",")

Function ArgsToArray(args)
  Dim ary, i, length
  ary = Array("", "both", "", "0")
  length = args.length - 1

  For i = 0 to length
    ary(i) = args.Item(i)
  Next

  ArgsToArray = ary
End Function

Function HasEntry()
  On Error Resume Next

  Dim num: num = UBound(aryEntries)

  If Err.Number <> 0 Then
    num = 0
  End If

  Err.Clear
  HasEntry = num
End Function

Sub ExtractEntries(path, collection)
  Dim entry, i

  For Each entry In collection
    If numRecursive > 0 And HasEntry() >= numRecursive Then
      Exit Sub
    End If

    If InStr(1, entry.Name, strPattern, 1) > 0 Then
      ReDim PreServe aryEntries(i)
      aryEntries(i) = fso.BuildPath(path, entry.Name)
      i = i + 1
    End If
  Next
End Sub

Sub GetEntries(path)
  Dim direnv, subDirenv, i, subDir
  Set direnv = fso.GetFolder(fso.BuildPath(strDirspec, path))
  Set subDirenv = direnv.SubFolders

  If strAtt <> "file" Then
    call ExtractEntries(path, subDirenv)
  End If

  If strAtt <> "dir" Then
    call ExtractEntries(path, direnv.Files)
  End If

  If numRecursive > 0 Then
    If HasEntry() >= numRecursive Then
      Exit Sub
    End If

    For Each subDir In subDirenv
      getEntries(fso.BuildPath(path, subDir.Name))
    Next
  End If
End Sub

