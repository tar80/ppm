'!*script
'
' Wait until the processID is activated
'
' @version 1.0
' @return {boolean} Running state of the process
' @arg {string} 0 Specify the process ID

Option Explicit

Dim intPid
intPid = arg_to_pid(PPx.Arguments)

PPx.Result = process_running(intPid)

Function arg_to_pid(arg)
  If arg.length < 1 Then
    arg_to_pid = 0
  Else
    arg_to_pid = CInt(arg.Item(0))
  End If
End Function

Function process_running(pid)
  Dim item, items
  process_running = false

  On Error Resume Next

  Set items = PPx.CreateObject("WbemScripting.SWbemLocator").ConnectServer.ExecQuery("Select * From Win32_Process")

  If pid > 0 Then
    For Each item In items
      If item.ProcessID = pid Then
        process_running = true
        Exit For
      End If
    Next
  End If

  On Error GoTo 0
End Function

