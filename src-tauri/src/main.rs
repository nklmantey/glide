#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use cocoa::{
    base::{id, nil},
    foundation::NSString,
};
use objc::{class, msg_send, sel, sel_impl};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use std::process::{Command, Stdio};
use sysinfo::{System, Signal};
use std::thread::sleep;
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct AppInfo {
    name: String,
    path: String,
    icon: Option<String>,
    bundle_id: Option<String>,
}

#[tauri::command]
async fn get_installed_apps() -> Result<Vec<AppInfo>, String> {
    let apps_dir = "/Applications";
    let mut apps = Vec::new();
    
    unsafe {
        let workspace: id = msg_send![class!(NSWorkspace), sharedWorkspace];
        
        if let Ok(entries) = fs::read_dir(apps_dir) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.extension().and_then(|s| s.to_str()) == Some("app") {
                        let ns_string = NSString::alloc(nil).init_str(path.to_str().unwrap());
                        let icon: id = msg_send![workspace, iconForFile: ns_string];
                        
                        let tiff_data: id = msg_send![icon, TIFFRepresentation];
                        let image_rep: id = msg_send![class!(NSBitmapImageRep), imageRepWithData: tiff_data];
                        let png_data: id = msg_send![image_rep, representationUsingType:4 properties:nil];
                        
                        let bytes: *const u8 = msg_send![png_data, bytes];
                        let length: usize = msg_send![png_data, length];
                        let icon_data = std::slice::from_raw_parts(bytes, length);
                        
                        let base64_icon = BASE64.encode(icon_data);
                        
                        apps.push(AppInfo {
                            name: path.file_stem().unwrap().to_string_lossy().into_owned(),
                            path: path.to_string_lossy().into_owned(),
                            icon: Some(format!("data:image/png;base64,{}", base64_icon)),
                            bundle_id: None,
                        });
                    }
                }
            }
        }
    }
    
    Ok(apps)
}

#[tauri::command]
async fn open_apps(app_paths: Vec<String>) -> Result<(), String> {
    for path in app_paths {
        match Command::new("open").arg(path).output() {
            Ok(_) => continue,
            Err(e) => return Err(format!("Failed to open application: {}", e)),
        }
    }
    Ok(())
}

#[tauri::command]
async fn close_apps(app_names: Vec<String>) -> Result<(), String> {
    let mut system = System::new_all();
    system.refresh_all();

    for app in app_names.iter() {
        let app_display_name = app.clone();
        let app_proc_name = format!("{}.app", app);

        let apple_script = format!(r#"tell application "{}" to quit"#, app_display_name);
        let _ = Command::new("osascript")
            .arg("-e")
            .arg(&apple_script)
            .output(); // Ignoring output as it may print warnings

        sleep(Duration::from_secs(3));
        system.refresh_all();

        // **Fix:** Collect process PIDs instead of borrowing processes
        let process_pids: Vec<_> = system.processes()
            .iter()
            .filter(|(_, p)| p.name().to_lowercase().contains(&app_proc_name.to_lowercase()))
            .map(|(pid, _)| *pid)
            .collect();

        if process_pids.is_empty() {
            continue;
        }

        for pid in &process_pids {
            if let Some(process) = system.process(*pid) {
                process.kill_with(Signal::Term);
            }
        }

        sleep(Duration::from_secs(2));
        system.refresh_all();

        for pid in process_pids {
            if let Some(process) = system.process(pid) {
                process.kill();
            }
        }
    }

    Ok(())
}

fn main() {
    let _ = fix_path_env::fix(); // <---- Add this
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_installed_apps, open_apps, close_apps])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}