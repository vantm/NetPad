using NetPad.Scripts;

namespace NetPad.Apps.UiInterop;

/// <summary>
/// Used to open various UI windows.
/// </summary>
public interface IUiWindowService
{
    Task OpenMainWindowAsync();
    Task OpenSettingsWindowAsync(string? tab = null);
    Task OpenScriptConfigWindowAsync(Script script, string? tab = null);
    Task OpenDataConnectionWindowAsync(Guid? dataConnectionId, bool copy = false);
    Task OpenOutputWindowAsync();
    Task OpenCodeWindowAsync();
}
