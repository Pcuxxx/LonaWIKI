# encoding: utf-8
# =============================================================================
#  LonaWiki Beacon 1.0.0
#  Press F9 on the map to open the Russian LonaRPG archive in your browser.
#
#  This mod does not change the database, maps, items or save files.
#  It only wraps Scene_Map#update and calls ShellExecute for one fixed URL.
#
#  Change HOTKEY below if F9 conflicts with another mod. RGSS3 names:
#  :F5 ... :F9, :SHIFT, :CTRL, :ALT, :A ... :Z
# =============================================================================

module LonaWikiBeacon
  VERSION = "1.0.0"
  URL     = "https://pcuxxx.github.io/LonaWIKI/"
  HOTKEY  = :F9

  def self.open_wiki
    # ShellExecuteA avoids a console window flash that `cmd /c start` produces.
    begin
      shell = Win32API.new("shell32", "ShellExecuteA", "lppppl", "l")
      shell.call(0, "open", URL, "", "", 1)
      return
    rescue Exception
      # Fall back to cmd on systems where Win32API is unavailable.
    end

    begin
      system("cmd.exe", "/c", "start", "", URL)
    rescue Exception
      # Never let a failed browser launch break the game loop.
    end
  end
end

class Scene_Map
  alias lonawiki_beacon_update update

  def update
    lonawiki_beacon_update

    return unless Input.trigger?(LonaWikiBeacon::HOTKEY)
    return if $game_message != nil && $game_message.visible
    return if $game_map == nil

    LonaWikiBeacon.open_wiki
  end
end
