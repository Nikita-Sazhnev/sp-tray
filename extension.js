const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;

let panelButton, panelButtonText, timeout;

function init () {
    panelButton = new St.Bin({
        style_class : "panel-button"
    });

    panelButtonText = new St.Label({
        style_class : "taskbarPanelText",
        text: "Yerim yerim yerim",
        y_align : Clutter.ActorAlign.CENTER
    });
    panelButton.set_child(panelButtonText);
}

function enable () {
    Main.panel._rightBox.insert_child_at_index(panelButton, 1);
    timeout = Mainloop.timeout_add_seconds(1, setButtonText);
}

function disable () {
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelButton);
}

function setButtonText () {

    var [ok, out, err, exit] = GLib.spawn_command_line_sync('./.sp.sh current');

    out = out.toString();

    if (out.includes("Error: ")) {
        panelButtonText.set_text("");
    } else {

        let artist = out.substring(out.indexOf("AlbumArtist") + 11,
            out.indexOf("\n", out.indexOf("AlbumArtist"))).trim();
        let track = out.substring(out.indexOf("Title") + 5).trim();

        panelButtonText.set_text(artist + " | " + track);
    }
    
    return true;
}