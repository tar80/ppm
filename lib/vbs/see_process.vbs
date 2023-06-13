'!*script
'
' Wait until the process is activated
'
' @version 1.0
' @desc Check every 500 milliseconds to see, whether the process is running
' @return {boolean} Running state of the process at script startup
' @arg {string} 0 Specify process Name
' @arg {number} 1 Specify waiting time (milliseconds). default = 6000
' @arg {string} 2 Specify process commandline. When the process is not runnning
' @arg {number} 3 Specify process startup style (WScript.Shell.Run(style)). default = 1
' NOTE:When "0" is specified for the waiting time, simply check the running.
' NOTE:Waiting time is not accurate. Set an approximate value.

Option Explicit

Const LOOP_MSEC = 500

Dim sh
Set sh = PPx.CreateObject("WScript.Shell")

Dim scriptName, aryParam, blnExist
scriptName = PPx.ScriptName
aryParam = args_to_array(PPx.Arguments)
blnExist = process_running(aryParam(0))

PPx.Result = blnExist

If not blnExist Then
  If aryParam(2) <> "" Then sh.run aryParam(2), aryParam(3)

  Dim i, w, pre, post
  i = 0
  w = LOOP_MSEC

  Do
    i = i + LOOP_MSEC
    PPx.Execute("*wait " & w - Fix(50 + 10 * w / 100) & ",2")

    If i >= aryParam(1) Then
      PPx.Setpoplinemessage("!""Abort. Waiting time exceeded.")
      PPx.Quit(-1)
    End If

    pre = Timer
    blnExist = process_running(aryParam(0))
    post = Timer

    If blnExist = true Then Exit Do

    w = LOOP_MSEC - Right("000" & Fix((post - pre) * 1000), 3)
  Loop While true
End If

Function args_to_array(args)
  Dim l, t, s, name, cmdline
  l = args.length
  t = 6000
  s = 1

  If l < 1 Then
    PPx.Echo(scriptName & ": Not enough arguments.")
    PPx.Quit(1)
  End If

  name = LCase(args.Item(0))

  If InStr(1, name, ".exe", 0) = 0 Then name = name + ".exe"

  If l > 2 Then cmdline = args.Item(2)

  On Error Resume Next

  If l > 1 Then
    t = CInt(args.Item(1))

    If Err.Number <> 0 Then
      PPx.Echo(scriptName & ": Wrong value" & vbCrLF & vbCrLF & "arg(1) Specify waiting time: milliseconds")
      PPx.Quit(1)
    End If
  End If


  If l > 3 Then
    s = CInt(args.Item(3))

    If Err.Number <> 0 or s > 10 Then
      PPx.Echo(scriptName & ": Wrong value" & vbCrLF & vbCrLF & "arg(3) Specify process startup style: 0-10")
      PPx.Quit(1)
    End If
  End If

  On Error GoTo 0

  args_to_array = Array(name, t, cmdline, s)
End Function

Function process_running(procName)
  Dim item, items
  process_running = false

  On Error Resume Next

  Set items = PPx.CreateObject("WbemScripting.SWbemLocator").ConnectServer.ExecQuery("Select * From Win32_Process")

  For Each item In items
    If LCase(item.Name) = procName Then
      process_running = true
      Exit For
    End If
  Next

  On Error GoTo 0
End Function

